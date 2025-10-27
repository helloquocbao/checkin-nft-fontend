import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useRouter } from "next/router";
import Meta from "../components/Meta";
import UserContext from "../components/UserContext";
import { useRef } from "react";
import {
  SuiClientProvider,
  createNetworkConfig,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://fullnode.testnet.sui.io:443" },
});

function MyApp({ Component, pageProps }) {
  const scrollRef = useRef({
    scrollPos: 0,
  });

  const queryClient = new QueryClient();

  return (
    <>
      <Meta title="Home 1" />
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider enableSystem={true} attribute="class">
            <SuiClientProvider
              networks={networkConfig}
              defaultNetwork="testnet"
            >
              <WalletProvider>
                <UserContext.Provider value={{ scrollRef: scrollRef }}>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </UserContext.Provider>
              </WalletProvider>
            </SuiClientProvider>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
