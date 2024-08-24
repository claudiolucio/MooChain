import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CreateVakinhaModal from "./CreateVakinhaModal";

// Paleta de Cores
const colors = {
  background: "#f0f4f8",
  primary: "#4caf50",
  secondary: "#388e3c",
  text: "#333",
  lightText: "#fff",
  cardBackground: "#fff",
  border: "#e0e0e0",
  hover: "#66bb6a",
  darkBackground: "#2c3e50",
  buttonSecondary: "#f44336", // Adicionada cor secundária para botão
  buttonSecondaryHover: "#e57373", // Cor de hover para botão secundário
};

// Estilização com styled-components
const Container = styled.div`
  padding: 20px;
  background-color: ${colors.background};
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: ${colors.darkBackground};
  border-radius: 8px;
  color: ${colors.lightText};
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
`;

const Button = styled.button<{ secondary?: boolean }>`
  padding: 10px 20px;
  background-color: ${({ secondary }) => (secondary ? colors.buttonSecondary : colors.primary)};
  color: ${colors.lightText};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin: 10px 0;
  &:hover {
    background-color: ${({ secondary }) => (secondary ? colors.buttonSecondaryHover : colors.hover)};
  }

  @media (min-width: 600px) {
    margin: 0 10px; // Espaçamento lateral entre os botões em telas maiores
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const WalletInfo = styled.p`
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
`;

const SearchSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 15px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  margin-bottom: 10px;
  font-size: 16px;
  max-width: 600px;
`;

const VakinhaList = styled.section`
  width: 100%;
  max-width: 800px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  justify-content: center;
`;

const VakinhaCard = styled.div`
  background-color: ${colors.cardBackground};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const VakinhaTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const VakinhaDescription = styled.p`
  color: ${colors.text};
  font-size: 16px;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: center; // Alinha os botões no centro horizontalmente em telas maiores
  }
`;

const Dashboard = () => {
  const { logout } = useAuth0();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vakinhaList, setVakinhaList] = useState([
    { id: 1, nome: "Vakinha 1", descricao: "Ajude a Vakinha 1" },
    { id: 2, nome: "Vakinha 2", descricao: "Ajude a Vakinha 2" },
  ]);
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredVakinhas = vakinhaList.filter((vakinha) =>
    vakinha.nome.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Erro ao conectar a MetaMask", error);
      }
    } else {
      alert("MetaMask não encontrada. Instale a extensão.");
    }
  };

  const switchWallet = async () => {
    if (window.ethereum) {
      try {
        // Requere ao usuário que selecione outra conta
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0 && accounts[0] !== walletAddress) {
          setWalletAddress(accounts[0]); // Atualiza com a nova carteira selecionada
        }
      } catch (error) {
        console.error("Erro ao trocar de carteira", error);
      }
    } else {
      alert("MetaMask não encontrada. Instale a extensão.");
    }
  };

  useEffect(() => {
    const storedVakinhaList = localStorage.getItem("vakinhaList");
    if (storedVakinhaList) {
      setVakinhaList(JSON.parse(storedVakinhaList));
    }
  }, []);

  const manageVakinha = (vakinhaId: number) => {
    const vakinha = vakinhaList.find((v) => v.id === vakinhaId);
    if (vakinha) {
      navigate(`/manage-vakinha/${vakinhaId}`);
    } else {
      alert("Você não tem permissão para gerenciar esta vakinha.");
    }
  };

  function createVakinhaOnBlockchain(nome: string, descricao: string, objetivo: number, duracao: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Container>
      <Header>
        <Heading>Vakinha Blockchain</Heading>
        <Button onClick={() => logout()} secondary>
          Logout
        </Button>
      </Header>

      <Section>
        {walletAddress ? (
          <SectionContent>
            <WalletInfo>Carteira conectada: {walletAddress}</WalletInfo>
            <ButtonGroup>
              <Button onClick={switchWallet} secondary>
                Trocar Carteira
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>Criar Nova Vakinha</Button>
            </ButtonGroup>
          </SectionContent>
        ) : (
          <Button onClick={connectWallet}>Conectar MetaMask</Button>
        )}
      </Section>

      <SearchSection>
        <SearchInput
          type="text"
          placeholder="Pesquisar vakinhas..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </SearchSection>

      <VakinhaList>
        {filteredVakinhas.length > 0 ? (
          filteredVakinhas.map((vakinha) => (
            <VakinhaCard
              key={vakinha.id}
              onMouseEnter={() => setHoverCard(vakinha.id)}
              onMouseLeave={() => setHoverCard(null)}>
              <VakinhaTitle>{vakinha.nome}</VakinhaTitle>
              <VakinhaDescription>{vakinha.descricao}</VakinhaDescription>
              <Button onClick={() => manageVakinha(vakinha.id)}>Gerenciar Vakinha</Button>
            </VakinhaCard>
          ))
        ) : (
          <p>Nenhuma vakinha encontrada</p>
        )}
      </VakinhaList>

      {isModalOpen && (
        <ModalOverlay>
          <CreateVakinhaModal onClose={() => setIsModalOpen(false)} onCreate={createVakinhaOnBlockchain} />
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Dashboard;
