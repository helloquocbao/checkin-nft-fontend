import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function WalletButton() {
  const account = useCurrentAccount();

  return (
    <ConnectButton>
      {({ isConnected }) => (
        <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2 rounded-full shadow-md transition-all duration-300">
          {isConnected ? "Connected" : "Connect Wallet"}
        </button>
      )}
    </ConnectButton>
  );
}
