import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  useReadVaquinhaGetVaquinha,
  useWriteVaquinhaWithdraw,
  useWriteVaquinhaContribute,
  useWriteVaquinhaDeleteVaquinha,
} from "./generated";
import { formatEther } from "viem";

const ManageVakinha: React.FC<{ contractAddress: `0x${string}` }> = ({ contractAddress }) => {
  const { vaquinhaId } = useParams();
  const { address: userAddress } = useAccount();
  const { state } = useLocation(); // Pega o estado da navegação

  const descricao = state?.descricao || "Descrição não disponível"; // Acessa a descrição do estado
  const [donationAmount, setDonationAmount] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Lê as informações da Vakinha
  const { data: vaquinhaData } = useReadVaquinhaGetVaquinha({
    address: contractAddress,
    args: [BigInt(vaquinhaId ?? 0)],
  });

  const nome = vaquinhaData ? vaquinhaData[0] : "Nome não disponível";
  const totalRaised = vaquinhaData ? vaquinhaData[3] : 0; // Saldo arrecadado
  const objective = vaquinhaData ? vaquinhaData[2] : 0; // Objetivo
  const creatorAddress = vaquinhaData ? vaquinhaData[1] : ""; // Criador

  const percentageRaised = objective ? (Number(totalRaised) / Number(objective)) * 100 : 0;

  const { writeContractAsync: withdraw } = useWriteVaquinhaWithdraw();
  const { writeContractAsync: contribute } = useWriteVaquinhaContribute();
  const { writeContractAsync: deleteVaquinha } = useWriteVaquinhaDeleteVaquinha();

  if (!vaquinhaId) {
    return <p>Nenhuma vakinha encontrada</p>;
  }

  const handleDelete = async () => {
    if (creatorAddress.toLowerCase() !== userAddress?.toLowerCase()) {
      setErrorMessage("Você não tem permissão para deletar esta Vakinha.");
      return;
    }

    if (totalRaised > 0) {
      setErrorMessage("Não é possível deletar uma vakinha com saldo.");
      return;
    }

    try {
      const result = await deleteVaquinha({ address: contractAddress, args: [BigInt(vaquinhaId)] });
      if (result) {
        setSuccessMessage("Vakinha deletada com sucesso!");
        navigate(-1); // Volta para a página anterior
      }
    } catch (error) {
      setErrorMessage("Falha ao deletar a Vakinha: " + (error as Error).message);
      setSuccessMessage(null);
    }
  };

  const handleWithdraw = async () => {
    if (creatorAddress.toLowerCase() !== userAddress?.toLowerCase()) {
      setErrorMessage("Você não tem permissão para sacar desta Vakinha.");
      return;
    }

    try {
      await withdraw({ address: contractAddress, args: [BigInt(vaquinhaId)] });
      setSuccessMessage("Saque realizado com sucesso!");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Falha ao realizar saque: " + (error as Error).message);
      setSuccessMessage(null);
    }
  };

  const handleDonate = async () => {
    if (percentageRaised >= 100) {
      setErrorMessage("A meta já foi alcançada. Não é possível doar.");
      return;
    }

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
        <CardTitle>{nome}</CardTitle> {/* Usa o nome da vakinha */}
        <DetailItem>
          <DetailLabel>Descrição:</DetailLabel> {descricao}
        </DetailItem>{" "}
        {/* Exibe a descrição da vakinha */}
        <Divider />
        <Details>
          <DetailItem>
            <DetailLabel>Endereço do Criador:</DetailLabel> {creatorAddress}
          </DetailItem>
          <DetailItem>
            <DetailLabel>Objetivo:</DetailLabel> {formatEther(BigInt(objective))} ETH
          </DetailItem>
          <DetailItem>
            <DetailLabel>Valor Arrecadado:</DetailLabel> {formatEther(BigInt(totalRaised))} ETH
          </DetailItem>
          <DetailItem>
            <DetailLabel>Porcentagem Arrecadada:</DetailLabel> {percentageRaised.toFixed(2)}%
          </DetailItem>
        </Details>
        <Divider />
        {isCreator ? (
          <ButtonContainer>
            <ActionButton onClick={handleWithdraw}>Sacar</ActionButton>
            {percentageRaised <= 0 && <DeleteButton onClick={handleDelete}>Excluir Vakinha</DeleteButton>}
          </ButtonContainer>
        ) : (
          <DonationSection>
            <DonationInput
              type="number"
              placeholder="Valor a doar (ETH)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <ActionButton onClick={handleDonate}>Doar</ActionButton>
          </DonationSection>
        )}
        {errorMessage && <Message error>{errorMessage}</Message>}
        {successMessage && <Message success>{successMessage}</Message>}
      </Card>
    </Container>
  );
};

export default ManageVakinha;

// Estilizações com styled-components
const colors = {
  background: "#f9fafc",
  primary: "#4caf50",
  secondary: "#388e3c",
  text: "#333",
  lightText: "#fff",
  cardBackground: "#fff",
  border: "#e0e0e0",
  hover: "#66bb6a",
  darkBackground: "#2c3e50",
  deleteButtonBackground: "#f44336", // Vermelho para o botão de exclusão
  deleteButtonHover: "#e57373",
};

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
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: ${colors.darkBackground};
  border-radius: 12px;
  color: ${colors.lightText};
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
`;

const Card = styled.div`
  background-color: ${colors.cardBackground};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
`;

const CardTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 20px;
  color: ${colors.text};
  text-align: center;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.border};
  margin: 20px 0;
`;

const Details = styled.div`
  font-size: 16px;
  color: ${colors.text};
  margin-bottom: 20px;
`;

const DetailItem = styled.p`
  margin: 8px 0;
`;

const DetailLabel = styled.span`
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: ${colors.primary};
  color: ${colors.lightText};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
  text-align: center;
  &:hover {
    background-color: ${colors.hover};
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: ${colors.deleteButtonBackground};
  &:hover {
    background-color: ${colors.deleteButtonHover};
  }
`;

const DonationSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const DonationInput = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  font-size: 16px;
  width: 94%;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 10px 20px;
  background-color: #388e3c;
  color: ${colors.lightText};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #66bb6a;
  }
`;

const Message = styled.p<{ error?: boolean; success?: boolean }>`
  margin-top: 20px;
  font-size: 16px;
  color: ${({ error, success }) => (error ? "red" : success ? "green" : colors.text)};
  text-align: center;
`;
