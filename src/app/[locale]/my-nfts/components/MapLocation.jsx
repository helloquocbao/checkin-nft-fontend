"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

export default function NFTMapLocate() {
  if (typeof window === "undefined") return null; // tránh render server
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [nfts, setNfts] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const defaultPosition = [10.762622, 106.660172]; // TP.HCM
  useEffect(() => {
    if (!account?.address) return;

    const packageId =
      "0xcc84871dc79970f2dab50400699552c2ebeba058c8e6a8a4e9f5ace44464311f";
    const moduleName = "checkin_nft";

    (async () => {
      const res = await client.getOwnedObjects({
        owner: account.address,
        options: { showType: true, showContent: true },
      });

      const userNFTs = res.data.filter((obj) =>
        obj.data?.content?.type?.includes(
          `${packageId}::${moduleName}::CheckinNFT`
        )
      );

      setNfts(userNFTs);
    })();
  }, [account, client]);

  const validNFTs = nfts
    .map((item) => item.data.content.fields)
    .filter((f) => f.latitude && f.longitude);
  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={defaultPosition}
        zoom={4}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        {validNFTs?.map((nft, i) => (
          <Marker
            key={i}
            position={[parseFloat(nft.latitude), parseFloat(nft.longitude)]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{nft.name}</strong>
              <br />
              {nft.latitude}, {nft.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
