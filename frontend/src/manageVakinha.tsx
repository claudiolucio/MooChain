import React, { useState } from "react";
import { useAccount, useReadContract, useSimulateContract } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useReadVaquinhaGetVaquinha, useWriteVaquinhaWithdraw } from "./generated";

const ManageVakinha: React.FC<{ contractAddress: `0x${string}` }> = ({ contractAddress }) => {
  // get the id from the url http://localhost:3000/manage-vakinha/2
  const { vaquinhaId } = useParams();
  console.log("vaquinhaId", vaquinhaId);
  const { address: userAddress } = useAccount();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Lê o endereço do criador da vakinha
  const { data: creatorAddress } = useReadContract({
    address: contractAddress,
    abi: vaquinhaAbi,
    functionName: "getCreator",
    args: [BigInt(vaquinhaId ?? 0)],
  });

  // Lê o valor total arrecadado pela vakinha
  const { data: totalRaised } = useReadVaquinhaGetVaquinha();

  // Simula a execução da função withdraw
  const { data: simulationData } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi: vaquinhaAbi,
    functionName: "withdraw",
    args: [BigInt(vaquinhaId ?? 0)],
  });

  const { writeContractAsync: withdraw } = useWriteVaquinhaWithdraw();

  if (!vaquinhaId) {
    return <p>Nenhuma vaquinha encontrada</p>;
  }

  const handleWithdraw = async () => {
    if (!simulationData?.request) {
      setErrorMessage("Falha na simulação ou dados ausentes.");
      return;
    }

    if (typeof creatorAddress === "string" && creatorAddress.toLowerCase() !== userAddress?.toLowerCase()) {
      setErrorMessage("Você não tem permissão para sacar desta Vakinha.");
      return;
    }

    try {
      withdraw({ address: contractAddress, args: [BigInt(vaquinhaId)] });
      setSuccessMessage("Saque realizado com sucesso!");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Falha ao realizar saque: " + (error as Error).message);
      setSuccessMessage(null);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <Heading>Gerencie sua Vakinha</Heading>
      </Header>
      <Card>
        <BackButton onClick={handleBack}>Voltar</BackButton>
        <CardTitle>Sua Vakinha: {vaquinhaId}</CardTitle>
        {typeof creatorAddress === "string" && <p>Endereço do Criador: {creatorAddress}</p>}
        <p>
          <strong>Valor Arrecadado:</strong> {JSON.stringify(totalRaised)} ETH
        </p>
        <Button onClick={handleWithdraw}>Sacar</Button>
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
