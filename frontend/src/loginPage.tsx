import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Paleta de Cores Verdes
const colors = {
  background: "#e0f5e8", // Fundo suave
  primary: "#2e8b57", // Verde escuro (botões e elementos principais)
  secondary: "#3cb371", // Verde médio (elementos secundários)
  textPrimary: "#ffffff", // Texto em botões
  textSecondary: "#333333", // Texto primário
  border: "#66cdaa", // Verde suave para bordas
  hover: "#1e6f46", // Cor ao passar o mouse sobre o botão
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: colors.background,
    fontFamily: "Arial, sans-serif",
    padding: "1rem",
  },
  box: {
    backgroundColor: colors.primary,
    padding: "2rem",
    borderRadius: "10px",
    textAlign: "center" as "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "90%", // Ajuste para telas menores
    width: "400px",  // Tamanho máximo da caixa
  },
  heading: {
    color: colors.textPrimary,
    marginBottom: "1rem",
    fontSize: "1.5rem",
  },
  button: {
    backgroundColor: colors.secondary,
    color: colors.textPrimary,
    padding: "0.75rem 1.5rem",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "background-color 0.3s ease",
    width: "100%", // Largura total em dispositivos móveis
    maxWidth: "200px",
  },
  profileImage: {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    marginBottom: "1rem",
  },
  text: {
    color: colors.textPrimary,
    fontSize: "1.2rem",
  },
  // Media queries para telas menores
  "@media (max-width: 600px)": {
    heading: {
      fontSize: "1.2rem",
    },
    box: {
      padding: "1.5rem",
      width: "100%",
    },
    button: {
      fontSize: "0.9rem",
      padding: "0.6rem 1rem",
    },
  }
};

const LoginPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  // Estado para gerenciar o hover no botão
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.text}>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {!isAuthenticated ? (
        <div style={styles.box}>
          <h2 style={styles.heading}>Faça login para continuar</h2>
          <button
            style={{
              ...styles.button,
              backgroundColor: isHovering ? colors.hover : colors.secondary, // Muda a cor ao passar o mouse
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => loginWithRedirect()}
          >
            Login
          </button>
        </div>
      ) : (
        <div style={styles.box}>
          <h2 style={styles.heading}>Bem-vindo, {user?.name}</h2>
          <img
            src={user?.picture}
            alt="Profile"
            style={styles.profileImage}
          />
          <p style={styles.text}>Email: {user?.email}</p>
          <button
            style={{
              ...styles.button,
              backgroundColor: isHovering ? colors.hover : colors.secondary, // Muda a cor ao passar o mouse
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
