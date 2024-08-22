/* eslint-disable linebreak-style */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./loginPage"; // Importe a página de login
import Dashboard from "./dashboard"; // Importe o Dashboard

function App() {
  const { isAuthenticated, isLoading } = useAuth0(); // Use o hook useAuth0 para autenticação

  // Mostre uma tela de carregamento enquanto o estado de autenticação está sendo carregado
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Se o usuário não estiver autenticado, mostre a página de login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Se o usuário estiver autenticado, mostre o dashboard
  return <Dashboard />;
}

export default App;
