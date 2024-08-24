import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';

// Configuração do cliente público test test
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

// Configuração de conectores
const { connectors } = getDefaultWallets({
  appName: 'YourAppName',
  chains: [mainnet, sepolia],
});

// Configuração do Wagmi
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider chains={[mainnet, sepolia]}>
        {/* Suas rotas e componentes */}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
