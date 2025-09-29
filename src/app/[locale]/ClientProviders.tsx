"use client";

import {
  SuiClientProvider,
  createNetworkConfig,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://fullnode.testnet.sui.io:443" },
});

// tạo QueryClient 1 lần
const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
