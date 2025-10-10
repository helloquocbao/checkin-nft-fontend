"use client";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import React, { useEffect, useState } from "react";

function shortenAddress(address, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
const Collection_items = () => {
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
  console.log(nfts);
  return (
    <section className="relative pb-10 pt-20 md:pt-32 h-1527">
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 block dark:hidden h-full">
        <img
          src="/images/gradient.jpg"
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden dark:block">
        <img
          src="/images/gradient_dark.jpg"
          alt="gradient dark"
          className="h-full w-full"
        />
      </picture>

      <div className="container h-full mx-auto">
        <div className="container">
          {/* trending categories */}
          {/* <!-- Filter --> */}

          {/* <!-- Grid --> */}
          {nfts.length === 0 ? (
            <p>No NFTs found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
              {nfts?.map((item) => {
                const {
                  id,
                  image,
                  title,
                  price,
                  bidLimit,
                  bidCount,
                  likes,
                  creator,
                  owner,
                } = item;
                const data = item.data.content.fields;
                console.log(data);
                return (
                  <article key={id}>
                    <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                      <figure className="relative">
                        <a>
                          <img
                            src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${data.image_url}`}
                            alt="item 5"
                            className="w-full h-[230px] rounded-[0.625rem] object-cover"
                          />
                        </a>

                        <div className="absolute left-3 -bottom-3">
                          <div className="flex -space-x-2"></div>
                        </div>
                      </figure>

                      <div className="mt-7 flex items-center justify-between">
                        <a>
                          <span className="font-display text-jacarta-700 hover:text-accent  dark:text-white">
                            {data?.name} #{shortenAddress(data?.id?.id)}
                          </span>
                        </a>

                        {/* auction dropdown  */}
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="dark:text-jacarta-200 text-jacarta-700 font-medium text-base mr-1">
                          {data?.rarity}
                        </span>
                        <br />
                        <span className="dark:text-jacarta-300 text-jacarta-500">
                          latitude: {data?.latitude}
                          <br />
                          longitude: {data?.longitude}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Collection_items;
