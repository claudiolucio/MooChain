import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import logo from "./img/logo.jpeg"; // Certifique-se de que o caminho da imagem esteja correto

const LoginPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

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
          <Heading>MooChain</Heading>
          <SubHeading>Sua vakinha na blockchain</SubHeading>
          <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => loginWithRedirect()}>
            Começar
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
              window.location.href = window.location.origin;
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
  background: "#e0f5e8",
  primary: "#2e8b57",
  secondary: "#3cb371",
  textPrimary: "#ffffff",
  textSecondary: "#333333",
  border: "#66cdaa",
  hover: "#1e6f46",
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
  width: 100%;

  max-width: 500px;

  @media (max-width: 768px) {
    padding: 2.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const Logo = styled.img`
  width: 300px;
  height: auto;
  margin-bottom: 2rem;
  border-radius: 50%;

  @media (max-width: 480px) {
    width: 120px;
  }
`;

const Heading = styled.h2`
  color: ${colors.textPrimary};
  margin-bottom: 1rem;
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const SubHeading = styled.p`
  color: ${colors.textPrimary};
  margin-bottom: 2rem;
  font-size: 1.4rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  background-color: ${colors.textPrimary};
  color: ${colors.primary};
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
    background-color: ${colors.background};
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const Text = styled.p`
  color: ${colors.textPrimary};
  font-size: 1.2rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
