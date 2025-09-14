"use client";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Props type for our MapView component
interface MapViewProps {
    center: [number, number];
    zoom: number;
    tempoTileUrl: string;
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


export default function MapView({ center, zoom, tempoTileUrl }: MapViewProps) {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} className="rounded-md">
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <TileLayer url={tempoTileUrl} opacity={0.6} attribution="NASA GIBS | TEMPO NO2" />
            <Marker position={center}>
                <Popup>Your selected location</Popup>
            </Marker>
        </MapContainer>
    );
}
