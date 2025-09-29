"use client";

import { useState } from "react";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

interface MintEvent {
  tokenId?: string;
  objectId?: string;
}

export function MintNFTCollect({
  packageId,
  moduleName,
  functionName,
}: {
  packageId: string;
  moduleName: string;
  functionName: string;
}) {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const client = useSuiClient();

  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<{ tokenId: string } | null>(null);

  const handleMint = async () => {
    if (!account) {
      alert("Vui lòng connect wallet trước!");
      return;
    }
    setLoading(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::${moduleName}::${functionName}`,
        arguments: [
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode("My Collection"))
          ),
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode("Demo description"))
          ),
          tx.pure.vector(
            "u8",
            Array.from(new TextEncoder().encode("https://example.com"))
          ),
        ],
      });

      // Gửi giao dịch
      const result = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      // Lấy chi tiết transaction có kèm events
      const txDetails = await client.waitForTransaction({
        digest: result.digest,
        options: { showEvents: true, showObjectChanges: true },
      });
      console.log("Tx details:", txDetails);

      // Tìm event liên quan
      const mintEvent = txDetails.events?.find((e) =>
        e.type.includes("Transfer")
      );

      const parsed = mintEvent?.parsedJson as MintEvent | undefined;
      const tokenId = parsed?.tokenId || parsed?.objectId;

      if (tokenId) {
        setNftInfo({ tokenId });
      } else {
        alert("Không tìm thấy tokenId trong event!");
      }
    } catch (err) {
      console.error("Mint error:", err);
      alert("Mint thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <button disabled>Đang mint...</button>
      ) : nftInfo ? (
        <div>
          <p>Mint thành công!</p>
          <p>Token ID: {nftInfo.tokenId}</p>
        </div>
      ) : (
        <button onClick={handleMint}>Mint Bộ sưu tập</button>
      )}
    </>
  );
}
