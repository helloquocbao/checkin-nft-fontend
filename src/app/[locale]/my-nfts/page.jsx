"use client";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export default function MyNFTs() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (!account?.address) return;

    // 🪄 Thay thế bằng packageId và module của bạn
    const packageId =
      "0xcc84871dc79970f2dab50400699552c2ebeba058c8e6a8a4e9f5ace44464311f"; // package ID của bạn
    const moduleName = "checkin_nft"; // module chứa struct CheckinNFT

    (async () => {
      const res = await client.getOwnedObjects({
        owner: account.address,
        options: { showType: true, showContent: true },
      });

      // Lọc theo đúng NFT của bạn (dựa trên type)
      const userNFTs = res.data.filter((obj) =>
        obj.data?.content?.type?.includes(
          `${packageId}::${moduleName}::CheckinNFT`
        )
      );

      setNfts(userNFTs);
    })();
  }, [account]);

  return (
    <section className="relative pb-10 pt-20 md:pt-32 h-1527">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">🎨 My Minted NFTs</h2>
        {nfts.length === 0 ? (
          <p>No NFTs found.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nfts.map((item) => {
              const data = item.data.content.fields;
              return (
                <li
                  key={item.data.objectId}
                  className="border rounded p-3 bg-white shadow"
                >
                  <img
                    src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${data.image_url}`}
                    alt={data.name}
                    className="rounded mb-2 h-32 w-full object-cover"
                  />
                  <p className="font-bold">{data.name}</p>
                  <p className="text-sm text-gray-600">Rarity: {data.rarity}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
