import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Importe o QueryClientProvider
import "@rainbow-me/rainbowkit/styles.css";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import authConfig from "../auth_config.json"; // Caminho ajustado
import { config } from "./wagmi"; // Importa a configuração do wagmi
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

// Cria o QueryClient
const queryClient = new QueryClient();

// Cria a raiz do React usando createRoot
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <Auth0Provider
          domain={authConfig.domain}
          clientId={authConfig.clientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}>
          <App />
        </Auth0Provider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>,
);
