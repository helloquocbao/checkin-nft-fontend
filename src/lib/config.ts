// config.ts
export const NETWORK = "testnet"; // hoặc 'mainnet'
export const PACKAGE_ID = "YOUR_DEPLOYED_PACKAGE_ID";

// Sui Client setup
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});
