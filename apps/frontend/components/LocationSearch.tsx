"use client";

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';

interface LocationSearchProps {
    onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [debouncedQuery] = useDebounce(query, 500); // 500ms delay

    useEffect(() => {
        if (debouncedQuery.length > 2) {
            const fetchSuggestions = async () => {
                const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
                if (!apiKey) {
                    console.error("OpenCage API key not found.");
                    return;
                }
                try {
                    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${debouncedQuery}&key=${apiKey}&limit=5`);
                    setSuggestions(response.data.results);
                } catch (error) {
                    console.error('Error fetching geocoding suggestions:', error);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    const handleSelect = (result: any) => {
        onLocationSelect(result.geometry.lat, result.geometry.lng, result.formatted);
        setQuery(result.formatted);
        setSuggestions([]);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city or address..."
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                    {suggestions.map((result) => (
                        <li
                            key={result.annotations.geohash}
                            onClick={() => handleSelect(result)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                        >
                            {result.formatted}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
