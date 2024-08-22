/* eslint-disable linebreak-style */
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Importe o QueryClientProvider
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import authConfig from "../auth_config.json"; // Caminho ajustado
import { config as wagmiConfig } from "./wagmi"; // Importa a configuração do wagmi

// Cria o QueryClient
const queryClient = new QueryClient();

// Cria a raiz do React usando createRoot
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <QueryClientProvider client={queryClient}> {/* Envolve o app com QueryClientProvider */}
    <WagmiConfig config={wagmiConfig}>
      <Auth0Provider
        domain={authConfig.domain}
        clientId={authConfig.clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
    </WagmiConfig>
  </QueryClientProvider>
);
