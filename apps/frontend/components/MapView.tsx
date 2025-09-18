"use client";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Props type for our MapView component
interface MapViewProps {
    center: [number, number];
    zoom: number;
    onMapClick: (lat: number, lon: number) => void; // Callback for when the map is clicked
}

// Fix for default Leaflet icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// A component to update map view when the center prop changes
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

// --- THIS IS THE FIX ---
// A new component to handle map clicks and normalize coordinates.
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) => {
    const normalizeLongitude = (lon: number): number => {
        // Wraps the longitude to the -180 to 180 range.
        return (lon + 180) % 360 - 180;
    };

    useMapEvents({
        click(e) {
            const normalizedLon = normalizeLongitude(e.latlng.lng);
            onMapClick(e.latlng.lat, normalizedLon);
        },
    });
    return null;
};
// ---------------------


export default function MapView({ center, zoom, onMapClick }: MapViewProps) {
    const [showTempo, setShowTempo] = useState(false);
    const tempoTileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_NO2_V03_Trop_Col/default/2023-11-01/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`;

    const MapBoundsChecker = () => {
        const map = useMap();
        useEffect(() => {
            const updateTempoVisibility = () => {
                const bounds = map.getBounds();
                // A rough bounding box for North America
                const naBounds = L.latLngBounds(L.latLng(25, -130), L.latLng(60, -60));
                if (bounds.intersects(naBounds)) {
                    setShowTempo(true);
                } else {
                    setShowTempo(false);
                }
            };
            map.on('moveend', updateTempoVisibility);
            updateTempoVisibility(); // Initial check
            return () => {
                map.off('moveend', updateTempoVisibility);
            };
        }, [map]);
        return null;
    };

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} className="rounded-md">
            <ChangeView center={center} zoom={zoom} />
            <MapClickHandler onMapClick={onMapClick} />
            <MapBoundsChecker />
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {showTempo && <TileLayer url={tempoTileUrl} opacity={0.6} attribution="NASA GIBS | TEMPO NO2" />}
            <Marker position={center}>
                <Popup>Your selected location</Popup>
            </Marker>
        </MapContainer>
    );
}

