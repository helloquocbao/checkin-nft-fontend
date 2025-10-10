"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CameraCapture from "@/components/cameraCapture/CameraCapture";
import Meta from "@/components/Meta";
import { walletModalShow } from "@/redux/counterSlice";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export default function Create() {
  const dispatch = useDispatch();
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [epochs, setEpochs] = useState(1);
  const [blobId, setBlobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState(null);

  const handleCapture = (blob) => {
    setImageBlob(blob);
    setImagePreview(URL.createObjectURL(blob));
  };

  // 🧩 Upload ảnh lên Walrus
  const handleUpload = async () => {
    if (!account) {
      dispatch(walletModalShow());
      return;
    }

    if (!imageBlob) {
      alert("Vui lòng chụp ảnh trước khi upload!");
      return;
    }

    try {
      setUploading(true);

      const response = await fetch(
        "https://publisher.walrus-testnet.walrus.space/v1/blobs",
        {
          method: "PUT",
          body: imageBlob,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const info = await response.json();
      console.log("✅ Walrus upload info:", info);

      const newBlobId =
        info?.newlyCreated?.blobObject?.blobId || info?.blobObject?.blobId;

      if (!newBlobId) {
        throw new Error("Không tìm thấy blobId trong phản hồi từ Walrus!");
      }

      console.log("🆔 Blob ID:", newBlobId);
      setBlobId(newBlobId);
      await handleMint(newBlobId);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert(`Upload lỗi: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // 🧩 Mint NFT
  const handleMint = async (newBlobId) => {
    if (!account) {
      dispatch(walletModalShow());
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Bắt đầu mint NFT với blobId:", newBlobId);
      const tx = new Transaction();

      tx.moveCall({
        target: `0x8a6b70d40ba106daa43249f6d1a4c78724deb7fca33bc8fa709fa73b7827d267::checkin_nft::mint`,
        arguments: [tx.pure.string("My NFT"), tx.pure.string(newBlobId)],
      });

      const result = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      // Chờ transaction hoàn tất
      const txDetails = await client.waitForTransaction({
        digest: result.digest,
        options: { showEvents: true, showObjectChanges: true },
      });

      console.log("📜 Tx details:", txDetails);

      const created = txDetails.objectChanges?.find(
        (c) => c.type === "created"
      );
      const objectId = created?.objectId;

      if (objectId) {
        const nftObject = await client.getObject({
          id: objectId,
          options: { showContent: true },
        });

        console.log("🎨 NFT Object:", nftObject);

        const fields = nftObject.data?.content?.fields;

        setNftInfo({
          id: objectId,
          name: fields?.name,
          image_url: fields?.image_url,
          rarity: fields?.rarity,
          completion: fields?.completion,
          owner: fields?.owner,
          digest: result.digest,
        });
      } else {
        alert("Không tìm thấy objectId trong transaction!");
      }
    } catch (err) {
      console.error("Mint error:", err);
      alert("Mint thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setImageBlob(null);
    setImagePreview("");
    setBlobId("");
    setNftInfo(null);
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
              disabled={uploading || loading}
              className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : loading
                ? "Minting..."
                : "✨ Upload & Mint"}
            </button>

            <button
              onClick={handleRetake}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              🔄 Chụp lại
            </button>
          </div>

          {loading && (
            <p className="text-gray-500 animate-pulse mt-2">
              Đang xử lý mint NFT...
            </p>
          )}

          {nftInfo && (
            <div className="mt-6 border-t pt-6 w-full max-w-md text-left">
              <h2 className="text-xl font-semibold mb-3">🎉 NFT Minted!</h2>

              <img
                src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${nftInfo.image_url}`}
                alt={nftInfo.name}
                className="w-full rounded-lg shadow-md mb-4"
              />

              <ul className="space-y-1 text-gray-700">
                <li>
                  <strong>ID:</strong> {nftInfo.id}
                </li>
                <li>
                  <strong>Name:</strong> {nftInfo.name}
                </li>
                <li>
                  <strong>Rarity:</strong> {nftInfo.rarity}
                </li>
                <li>
                  <strong>Completion:</strong> {nftInfo.completion}
                </li>
                <li>
                  <strong>Owner:</strong> {nftInfo.owner}
                </li>
              </ul>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${nftInfo.image_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  🔗 View image on Walrus
                </a>

                <a
                  href={`https://suiexplorer.com/txblock/${nftInfo.digest}?network=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline"
                >
                  🔍 View on Sui Explorer
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
