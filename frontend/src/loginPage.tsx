import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

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

// Estilização com styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${colors.background};
  font-family: Arial, sans-serif;
  padding: 1rem;
`;

const Box = styled.div`
  background-color: ${colors.primary};
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 90%; // Ajuste para telas menores
  width: 400px;  // Tamanho máximo da caixa

  @media (max-width: 600px) {
    padding: 1.5rem;
    width: 100%;
  }
`;

const Heading = styled.h2`
  color: ${colors.textPrimary};
  margin-bottom: 1rem;
  font-size: 1.5rem;

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  background-color: ${colors.secondary};
  color: ${colors.textPrimary};
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  width: 100%; // Largura total em dispositivos móveis
  max-width: 200px;

  &:hover {
    background-color: ${colors.hover};
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: ${colors.textPrimary};
  font-size: 1.2rem;
`;

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
      <Container>
        <Text>Carregando...</Text>
      </Container>
    );
  }

  return (
    <Container>
      {!isAuthenticated ? (
        <Box>
          <Heading>Faça login para continuar</Heading>
          <Button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => loginWithRedirect()}
          >
            Login
          </Button>
        </Box>
      ) : (
        <Box>
          <Heading>Bem-vindo, {user?.name}</Heading>
          <ProfileImage
            src={user?.picture}
            alt="Profile"
          />
          <Text>Email: {user?.email}</Text>
          <Button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              logout();
              window.location.href = window.location.origin; // Redirecionamento manual após logout
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default LoginPage;
