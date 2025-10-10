"use client";
import dynamic from "next/dynamic";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import React, { useEffect, useState } from "react";

// ✅ Import tắt SSR toàn bộ component map
const NFTMap = dynamic(() => import("@/components/NFTMap/NFTMap"), {
  ssr: false,
});

export default function Collection_items() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [nfts, setNfts] = useState([]);

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
    <section className="relative pb-10 pt-20 md:pt-32">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🗺️ My NFT Check-in Map
        </h2>

        {validNFTs.length > 0 ? (
          <NFTMap nfts={validNFTs} />
        ) : (
          <p className="text-center mt-10">No NFTs found.</p>
        )}
      </div>
    </section>
  );
}
