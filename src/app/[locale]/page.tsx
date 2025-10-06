/** @format */

"use client";
// import handleAPI from "@/apis/handleAPI";
import { MintNFTButton } from "@/components/mintNFTButton/MintNFTButton";
import { MintNFTCollect } from "@/components/mintNFTCollect/MintNFTCollect";
import { useLocale, useTranslations } from "next-intl";

const Home = () => {
  const t = useTranslations("Welcome");
  const locale = useLocale();
  console.log("Locale:", locale);

  // ví dụ dùng Redux
  // const auth = useSelector(authSelector);
  // console.log(auth);

  // ví dụ dùng handleAPI
  // const getPosts = async () => {
  //   try {
  //     const res = await handleAPI("/posts");
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="container py-4">
      <div className="row ">
        <div className="col-sm-12 col-md-8 offset-md-2">
          <div className="mt-5 py-5 text-center text-red">{t("title")}</div>
          <MintNFTButton
            packageId={
              "0x020dd0b594355313adb92344e9afd35b37359635fc30cc7350db18d24e949da1"
            }
            moduleName={"nft_frame"}
            functionName={"mint_and_transfer"}
          />
          mint collect
          <MintNFTCollect
            packageId={
              "0xbad9dae62e2bd96f423174014a8feed2bb0fea4390511e3aa17fbaccfb89e9e2"
            }
            moduleName={"collection"}
            functionName={"create_collection"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
