import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <h2>Você não está autenticado</h2>
          <button onClick={() => loginWithRedirect()}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Bem-vindo, {user?.name}</h2>
          <img src={user?.picture} alt="Profile" />
          <p>Email: {user?.email}</p>
          <button
            onClick={() => {
              logout();
              window.location.href = window.location.origin; // Redirecionamento manual após logout
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
