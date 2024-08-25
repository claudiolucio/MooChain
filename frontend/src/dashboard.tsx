import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CreateVakinhaModal from "./CreateVakinhaModal";
import { useReadVaquinhaGetVaquinhaCount, useWriteVaquinhaCreateVaquinha } from "./generated";
import { useNavigate } from "react-router-dom";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "./wagmi";
import RenderVaquinhasById from "./RenderVaquinhasById";

const Dashboard = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
  const { logout } = useAuth0();
  const { address, isConnected } = useAccount();
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

  const { writeContractAsync: createVaquinha } = useWriteVaquinhaCreateVaquinha();

  const renderAllVakinhas = () => {
    const { data: vaquinhaCount } = useReadVaquinhaGetVaquinhaCount({ address: contractAddress });
    if (!vaquinhaCount) return <p>Nenhuma vaquinha encontrada</p>;
    const tempArray = Array.from({ length: Number(vaquinhaCount) }, (_, i) => i);

    return (
      <>
        {tempArray.map((vaquinhaId) => (
          <RenderVaquinhasById key={vaquinhaId} vaquinhaId={vaquinhaId} contractAddress={contractAddress} />
        ))}
      </>
    );
  };

  const navigate = useNavigate();

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

  const createVakinhaOnBlockchain = async (
    nome: string,
    descricao: string,
    objetivo: number,
    duracao: number,
  ): Promise<void> => {
    try {
      // A função `createVaquinha` está retornando diretamente o hash da transação
      const txHash = await createVaquinha({
        args: [nome, BigInt(objetivo), BigInt(duracao)],
        address: contractAddress,
      });

      // console.log('Hash da Transação:', txHash);

      // Use diretamente o hash retornado para esperar pelo recibo
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      if (receipt.status === "success") {
        const newVakinha = { id: vakinhaList.length + 1, nome, descricao };
        setVakinhaList((prevList) => [...prevList, newVakinha]);
        localStorage.setItem("vakinhaList", JSON.stringify([...vakinhaList, newVakinha]));
        console.log("A vakinha foi criada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar a Vakinha na blockchain:", error);
    }
  };

  return (
    <Container>
      <Header>
        <Heading>Vakinha Blockchain</Heading>
        <Button onClick={() => logout()} secondary>
          Logout
        </Button>
      </Header>
      <Section>
        {isConnected ? (
          <SectionContent>
            <WalletInfo>Carteira conectada: {address}</WalletInfo>
            <ButtonGroup>
              <ConnectButton label="Trocar Carteira" />
              <Button onClick={() => setIsModalOpen(true)}>Criar Nova Vakinha</Button>
            </ButtonGroup>
          </SectionContent>
        ) : (
          <ConnectButton label="Conectar MetaMask" />
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
      {renderAllVakinhas()}
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
  buttonSecondary: "#f44336",
  buttonSecondaryHover: "#e57373",
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
    margin: 0 10px;
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
    justify-content: center;
  }
`;
