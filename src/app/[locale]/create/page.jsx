"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CameraCapture from "@/components/cameraCapture/CameraCapture";
import Meta from "@/components/Meta";
import { FUNCTION_NAME, MODULE_NAME, PACKAGE_ID } from "@/lib/constant";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { walletModalShow } from "@/redux/counterSlice"; // nếu bạn dùng Redux hiển thị modal
import { Transaction } from "@mysten/sui/transactions";

const PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";

export default function Create() {
  const dispatch = useDispatch();
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [epochs, setEpochs] = useState(1);
  const [blobId, setBlobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState(null);

  const handleCapture = (blob) => {
    setImageBlob(blob);
    setImagePreview(URL.createObjectURL(blob));
  };

  // 🧩 Mint NFT sau khi upload
  const handleMint = async (newBlobId) => {
    if (!account) {
      dispatch(walletModalShow());
      return;
    }

    setLoading(true);
    try {
      const tx = new Transaction();
      const blobStr = String(newBlobId);

      // 1️⃣ Tạo random object

      // 2️⃣ Gọi hàm mint trong module của bạn
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
        arguments: [
          tx.pure.string("My NFT"),
          tx.pure.string(blobStr),
          tx.object("0x8"),
        ],
      });

      // 3️⃣ Gửi transaction
      const result = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      // 4️⃣ Chờ kết quả
      const txDetails = await client.waitForTransaction({
        digest: result.digest,
        options: { showEvents: true, showObjectChanges: true },
      });

      console.log("Tx details:", txDetails);

      const created = txDetails.objectChanges?.find(
        (c) => c.type === "created"
      );

      if (created) {
        setNftInfo({ tokenId: created.objectId });
        alert("✅ Mint thành công!");
      } else {
        alert("Không tìm thấy tokenId!");
      }
    } catch (err) {
      console.error("Mint error:", err);
      alert("Mint thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Upload ảnh lên Walrus
  const handleUpload = async () => {
    await handleMint("zTR9A0n3IhO4Aa2r2DFfGDdJhiWaopj2n7nhO5o-It8");

    // if (!account) {
    //   dispatch(walletModalShow());
    //   return;
    // }

    // if (!imageBlob) {
    //   alert("Vui lòng chụp ảnh trước khi upload!");
    //   return;
    // }

    // try {
    //   setUploading(true);
    //   setResult(null);

    //   const url = `${PUBLISHER_URL}/v1/blobs?epochs=${epochs}`;
    //   console.log("Uploading to:", url);

    //   const response = await fetch(url, {
    //     method: "PUT",
    //     body: imageBlob,
    //   });

    //   if (response.ok) {
    //     const info = await response.json();
    //     const newBlobId = info?.newlyCreated?.blobObject?.blobId;
    //     console.log("✅ Upload thành công:", newBlobId);
    //     setBlobId(newBlobId);
    //     setResult(info);
    //     await handleMint(newBlobId);
    //   } else {
    //     console.error("❌ Upload thất bại:", response.status);
    //     setResult({ error: "Upload failed", status: response.status });
    //   }
    // } catch (err) {
    //   console.error("❌ Error:", err);
    //   setResult({ error: err.message });
    // } finally {
    //   setUploading(false);
    // }
  };

  const handleRetake = () => {
    setImageBlob(null);
    setImagePreview("");
    setResult(null);
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

          {nftInfo && (
            <p className="text-green-600 mt-2">
              ✅ Token ID: {nftInfo.tokenId}
            </p>
          )}

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
