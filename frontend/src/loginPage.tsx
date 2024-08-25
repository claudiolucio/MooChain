import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import logo from "./img/logo.jpeg"; // Importe a imagem diretamente

const LoginPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
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
          <Logo src={logo} alt="Logo MooCow" />
          <Heading>MooCow</Heading>
          <SubHeading>Sua vakinha na blockchain</SubHeading>
          <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => loginWithRedirect()}>
            Login
          </Button>
        </Box>
      ) : (
        <Box>
          <Heading>Bem-vindo, {user?.name}</Heading>
          <ProfileImage src={user?.picture} alt="Profile" />
          <Text>Email: {user?.email}</Text>
          <Button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              logout();
              window.location.href = window.location.origin; // Redirecionamento manual após logout
            }}>
            Logout
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default LoginPage;

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
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 95%;
  width: 500px;

  @media (max-width: 600px) {
    padding: 2.5rem;
    width: 100%;
  }
`;

const Logo = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 2rem;
  border-radius: 50%;
`;

const Heading = styled.h2`
  color: ${colors.textPrimary};
  margin-bottom: 1rem;
  font-size: 2.5rem;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const SubHeading = styled.p`
  color: ${colors.textPrimary};
  margin-bottom: 2rem;
  font-size: 1.4rem;
`;

const Button = styled.button`
  background-color: ${colors.secondary};
  color: ${colors.textPrimary};
  padding: 1rem 2rem;
  border-radius: 10px;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 300px;

  &:hover {
    background-color: ${colors.hover};
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
`;

const Text = styled.p`
  color: ${colors.textPrimary};
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;
