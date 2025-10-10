"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 👉 load MapContainer và các thành phần qua dynamic import (tắt SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

export default function NFTMap({ nfts }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return <p className="text-center">🗺️ Loading map...</p>;

  const defaultPosition = [10.762622, 106.660172];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden mb-10">
      <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {nfts.map((item) => (
          <Marker
            key={item.id?.id || item.name}
            position={[item.latitude, item.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{item.name}</strong>
              <br />
              Rarity: {item.rarity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
