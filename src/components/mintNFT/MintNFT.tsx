import { FUNCTION_NAME, MODULE_NAME, PACKAGE_ID } from "@/lib/constant";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export default function MintButton({ imageUrl }: { imageUrl: string }) {
  const { signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleMint = async () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [tx.pure.string("My Checkin NFT"), tx.pure.string(imageUrl)],
    });

    const result = await signAndExecuteTransaction({
      transactionBlock: tx,
      chain: "sui:testnet",
    });

    console.log("✅ Mint result:", result);
  };

  return (
    <button
      onClick={handleMint}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Mint NFT
    </button>
  );
}
