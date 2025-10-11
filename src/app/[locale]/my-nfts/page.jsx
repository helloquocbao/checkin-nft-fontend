"use client";
import dynamic from "next/dynamic";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import React, { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

function shortenAddress(address, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// ✅ Import tắt SSR cho bản đồ
const NFTMap = dynamic(() => import("@/components/NFTMap/NFTMap"), {
  ssr: false,
});

export default function Collection_items() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [nfts, setNfts] = useState([]);
  const [showMap, setShowMap] = useState(false);

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
        <h2 className="text-2xl font-bold mb-6 text-center">
          🌍 My NFT Check-in Collection
        </h2>

        {/* ✅ Danh sách NFT hiển thị mặc định */}
        {validNFTs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {validNFTs?.map((item) => {
                return (
                  <article key={item?.id?.id}>
                    <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                      <figure className="relative">
                        <a>
                          <img
                            src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${item?.image_url}`}
                            alt="item 5"
                            className="w-full h-[230px] rounded-[0.625rem] object-cover"
                          />
                        </a>
                      </figure>
                      <div className="mt-7 flex items-center justify-between">
                        <a>
                          <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                            {item?.name}{" "}
                            <span>#{shortenAddress(item?.id?.id)}</span>
                          </span>
                        </a>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                          {item?.rarity}
                        </span>
                        <span className="dark:text-jacarta-300 text-jacarta-500">
                          {item?.latitude}
                          <br />
                          {item?.longitude}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Nút toggle bản đồ */}
            <div className="text-center mt-10">
              <button
                onClick={() => setShowMap((prev) => !prev)}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition"
              >
                {showMap ? "Hide Map" : "🗺️ View on Map"}
              </button>
            </div>

            {/* Hiển thị bản đồ khi toggle bật */}
            {showMap && validNFTs && (
              <div className="mt-8 border rounded-xl overflow-hidden shadow-lg animate-fade-in">
                <NFTMap nfts={validNFTs} />
              </div>
            )}
          </>
        ) : (
          <p className="text-center mt-10 text-gray-500">No NFTs found.</p>
        )}
      </div>
    </section>
  );
}
