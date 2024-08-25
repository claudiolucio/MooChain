import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./dashboard";
import ManageVakinha from "./manageVakinha";
import LoginPage from "./loginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard contractAddress="0x72bb9c7ffbE2Ed234e53bc64862DdA6d9fFF333b" />,
  },
  {
    path: "/manage-vakinha/:vaquinhaId",
    element: <ManageVakinha contractAddress="0x72bb9c7ffbE2Ed234e53bc64862DdA6d9fFF333b" />,
  },
]);

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Carregando...</div>; // Mostra algo enquanto o Auth0 carrega
  }

  return (
    <React.StrictMode>
      {/* Verifica se o usuário está autenticado */}
      {isAuthenticated ? (
        <RouterProvider router={router} />
      ) : (
        <LoginPage /> // Redireciona para a página de login se não estiver autenticado
      )}
    </React.StrictMode>
  );
}
