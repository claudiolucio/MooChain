import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, sepolia, hardhat, mainnet, optimism, polygon } from "viem/chains";

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base, hardhat, sepolia],
});
