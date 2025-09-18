"use client";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useEffect, useState } from 'react';

// Props type for our MapView component
interface MapViewProps {
    center: [number, number];
    zoom: number;
    onMapClick: (lat: number, lon: number) => void;
}

// Fix for default Leaflet icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// A component to update map view and handle conditional layers
const MapController = ({ center, zoom, onMapClick }: { center: [number, number], zoom: number, onMapClick: (lat: number, lon: number) => void }) => {
    const map = useMap();
    const [tempoLayer, setTempoLayer] = useState<L.TileLayer | null>(null);

    // Pan/zoom the map when center changes
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    // Add or remove TEMPO layer based on location
    useEffect(() => {
        const isNorthAmerica = center[0] > 24 && center[0] < 60 && center[1] < -60 && center[1] > -125;

        if (isNorthAmerica && !tempoLayer) {
            const newLayer = L.tileLayer(
                `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_NO2_V03_Trop_Col/default/2023-11-01/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`,
                { opacity: 0.7, attribution: "NASA GIBS | TEMPO NO2" }
            ).addTo(map);
            setTempoLayer(newLayer);
        } else if (!isNorthAmerica && tempoLayer) {
            map.removeLayer(tempoLayer);
            setTempoLayer(null);
        }
    }, [center, map, tempoLayer]);

    useMapEvents({
        click(e) { onMapClick(e.latlng.lat, e.latlng.lng); },
    });

    return null;
};


export default function MapView({ center, zoom, onMapClick }: MapViewProps) {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} className="rounded-md">
            <MapController center={center} zoom={zoom} onMapClick={onMapClick} />
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={center}>
                <Popup>Your selected location</Popup>
            </Marker>
        </MapContainer>
    );
}

