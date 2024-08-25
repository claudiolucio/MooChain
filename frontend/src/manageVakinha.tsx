import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useReadVaquinhaGetVaquinha, useWriteVaquinhaWithdraw, useWriteVaquinhaContribute } from "./generated";
import { formatEther } from "viem";

const ManageVakinha: React.FC<{ contractAddress: `0x${string}` }> = ({ contractAddress }) => {
  const { vaquinhaId } = useParams();
  const { address: userAddress, chainId } = useAccount();
  const { state } = useLocation();

  // Adicionando log para verificar o estado recebido
  console.log("Estado recebido na navegação:", state);

  const descricao = state?.descricao || "Descrição não disponível";
  const [donationAmount, setDonationAmount] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Lê as informações da Vakinha
  const { data: vaquinhaData } = useReadVaquinhaGetVaquinha({
    address: contractAddress,
    args: [BigInt(vaquinhaId ?? 0)],
  });

  console.log("vaquinhaId:", vaquinhaId ?? 0);
  console.log("Endereço do contrato:", contractAddress);
  console.log("Dados da vakinha:", vaquinhaData);

  const totalRaised = vaquinhaData ? vaquinhaData[3] : 0; // Índice 3 é o saldo da vakinha
  const creatorAddress = vaquinhaData ? vaquinhaData[1] : ""; // Índice 1 é o criador

  const { writeContractAsync: withdraw } = useWriteVaquinhaWithdraw();
  const { writeContractAsync: contribute } = useWriteVaquinhaContribute();

  if (!vaquinhaId) {
    return <p>Nenhuma vaquinha encontrada</p>;
  }

  const handleWithdraw = async () => {
    if (creatorAddress.toLowerCase() !== userAddress?.toLowerCase()) {
      setErrorMessage("Você não tem permissão para sacar desta Vakinha.");
      return;
    }

    try {
      await withdraw({
        address: contractAddress,
        args: [BigInt(vaquinhaId)],
      });
      setSuccessMessage("Saque realizado com sucesso!");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Falha ao realizar saque: " + (error as Error).message);
      setSuccessMessage(null);
    }
  };

  const handleDonate = async () => {
    if (!donationAmount || isNaN(Number(donationAmount))) {
      setErrorMessage("Por favor, insira um valor válido para doar.");
      return;
    }

    try {
      await contribute({
        address: contractAddress,
        args: [BigInt(vaquinhaId)],
        value: BigInt(Number(donationAmount) * 1e18), // Converte para wei
      });
      setSuccessMessage("Doação realizada com sucesso!");
      setErrorMessage(null);
      console.log("saldo da vaquinha", Number(totalRaised));
    } catch (error) {
      setErrorMessage("Falha ao realizar doação: " + (error as Error).message);
      setSuccessMessage(null);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isCreator = creatorAddress.toLowerCase() === userAddress?.toLowerCase();

  return (
    <Container>
      <Header>
        <Heading>Gerencie sua Vakinha</Heading>
      </Header>
      <Card>
        <BackButton onClick={handleBack}>Voltar</BackButton>
        <CardTitle>Sua Vakinha: {vaquinhaId}</CardTitle>
        <p>{contractAddress}</p>
        <p>
          <strong>Endereço do Criador:</strong> {creatorAddress}
        </p>
        <p>chainId: {chainId}</p>
        <p>
          <strong>Descrição:</strong> {descricao}
        </p>
        <p>
          <strong>Valor Arrecadado:</strong> {formatEther(BigInt(totalRaised))} ETH
        </p>
        {isCreator ? (
          <Button onClick={handleWithdraw}>Sacar</Button>
        ) : (
          <>
            <input
              type="number"
              placeholder="Valor a doar (ETH)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              style={styles.input}
            />
            <Button onClick={handleDonate}>Doar</Button>
          </>
        )}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </Card>
    </Container>
  );
};

export default ManageVakinha;

// Estilizações com styled-components
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
};

const Header = styled.header`
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
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

const Container = styled.div`
  padding: 20px;
  background-color: ${colors.background};
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  background-color: ${colors.cardBackground};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
`;

const CardTitle = styled.h2`
  margin-top: 0;
  font-size: 18px;
  color: ${colors.text};
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${colors.primary};
  color: ${colors.lightText};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${colors.hover};
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: cyan;
  color: ${colors.lightText};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: blue;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 16px;
  margin-top: 20px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 16px;
  margin-top: 20px;
`;

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
  },
};

export const vaquinhaAbi = [
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "vaquinhaId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getCreator",
    stateMutability: "view",
    inputs: [{ name: "vaquinhaId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "getTotalRaised",
    stateMutability: "view",
    inputs: [{ name: "vaquinhaId", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
] as const;
