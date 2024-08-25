import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, hardhat, mainnet, optimism, polygon, baseSepolia } from "viem/chains";

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base, hardhat, baseSepolia],
});
