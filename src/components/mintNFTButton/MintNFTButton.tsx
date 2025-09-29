"use client";

import { useState } from "react";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import type { SuiObjectChange } from "@mysten/sui/client";

interface MintEvent {
  tokenId?: string;
  objectId?: string;
}

export function MintNFTButton({
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
        arguments: [tx.pure.u64(1), tx.pure.u8(100), tx.pure.u64(9000)],
      });

      // Gửi giao dịch
      const result = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      // Lấy chi tiết transaction kèm events + object changes
      const txDetails = await client.waitForTransaction({
        digest: result.digest,
        options: { showEvents: true, showObjectChanges: true },
      });

      console.log("Tx details:", txDetails);

      // Ưu tiên lấy từ event
      const mintEvent = txDetails.events?.find((e) =>
        e.type.includes("Transfer")
      );
      const parsed = mintEvent?.parsedJson as MintEvent | undefined;
      let tokenId = parsed?.tokenId || parsed?.objectId;

      // Nếu không có event thì fallback lấy objectChanges.created
      if (!tokenId && txDetails.objectChanges) {
        const created = txDetails.objectChanges.find(
          (
            c: SuiObjectChange
          ): c is Extract<SuiObjectChange, { type: "created" }> =>
            c.type === "created"
        );
        tokenId = created?.objectId;
      }

      if (tokenId) {
        setNftInfo({ tokenId });
      } else {
        alert("Không tìm thấy tokenId trong event hoặc objectChanges!");
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
        <button onClick={handleMint}>Mint NFT</button>
      )}
    </>
  );
}
