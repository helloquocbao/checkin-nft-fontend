"use client";
import React, { useState } from "react";
import CameraCapture from "@/components/cameraCapture/CameraCapture";
import Meta from "@/components/Meta";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { FUNCTION_NAME, MODULE_NAME, PACKAGE_ID } from "@/lib/constant";
const PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";

export default function Create() {
  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [epochs, setEpochs] = useState(1);
  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const handleCapture = (blob) => {
    setImageBlob(blob);
    setImagePreview(URL.createObjectURL(blob));
  };


  const handleMint = async (urlImage) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [tx.pure.string("My Checkin NFT"), tx.pure.string(urlImage)],
    });

    const result = await signAndExecuteTransaction({
      transactionBlock: tx,
      chain: "sui:testnet",
    });

    console.log("✅ Mint result:", result);
  };


  const handleUpload = async () => {
    if (!imageBlob) {
      alert("Vui lòng chụp ảnh trước khi upload!");
      return;
    }

    try {
      setUploading(true);
      setResult(null);

      const url = `${PUBLISHER_URL}/v1/blobs?epochs=${epochs}`;
      console.log("Uploading to:", url);
    
      const response = await fetch(url, {
        method: "PUT",
        body: imageBlob,
      });

   

  

      if (response.ok) {
        const info = await response.json();
        await handleMint(info?.newlyCreated?.blobObject?.blobId);
        console.log("✅ Upload thành công:", info);
        setResult(info);
      } else {
        console.error("❌ Upload thất bại:", response.status);
        setResult({ error: "Upload failed", status: response.status });
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setResult({ error: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleRetake = () => {
    setImageBlob(null);
    setImagePreview("");
    setResult(null);
  };

  return (
    <div className="container text-center py-12">
      <Meta title="Create NFT with Walrus" />
      <h1 className="text-3xl font-semibold mb-6">Create NFT</h1>

      {!imageBlob && <CameraCapture onCapture={handleCapture} />}

      {imageBlob && (
        <div className="flex flex-col items-center gap-4">
          <img
            src={imagePreview}
            alt="preview"
            className="w-64 h-64 object-cover rounded shadow-md"
          />

          <div className="flex gap-2 items-center">
            <label>Epochs:</label>
            <input
              type="number"
              value={epochs}
              min="1"
              onChange={(e) => setEpochs(Number(e.target.value))}
              className="border px-2 py-1 w-16 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "✨ Upload to Walrus"}
            </button>

            <button
              onClick={handleRetake}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              🔄 Chụp lại
            </button>
          </div>

          {result && (
            <pre className="text-left bg-gray-100 p-3 rounded mt-4 max-w-md break-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}

      



        </div>
      )}

 
   
    </div>
  );
}
