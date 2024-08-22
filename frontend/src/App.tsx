/* eslint-disable linebreak-style */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import Contract from "./Contract";
import LoginPage from "./loginPage"; // Importe a página de login

const CHAIN_ID = import.meta.env.DEV ? hardhat.id : sepolia.id;

function App() {
  const { isAuthenticated, isLoading } = useAuth0(); // Use o hook useAuth0 para autenticação
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const isCorrectChain = CHAIN_ID === account.chainId;

  // Mostre uma tela de carregamento enquanto o estado de autenticação está sendo carregado
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Se o usuário não estiver autenticado, mostre a página de login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Se o usuário estiver autenticado, mostre o restante da aplicação
  return (
    <>
      <div>
        <h2>Account</h2>
        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button key={connector.id} onClick={() => connect({ connector })} type="button">
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      
      <div>
        <h2>Contract</h2>
        {isCorrectChain ? (
          <Contract />
        ) : (
          <button type="button" onClick={() => switchChain({ chainId: CHAIN_ID })}>
            Switch chain
          </button>
        )}
      </div>
    </>
  );
}

export default App;
