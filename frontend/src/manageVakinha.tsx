import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import styled from "styled-components";

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

const Container = styled.div`
    padding: 20px;
    background-color: ${colors.background};
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Heading = styled.h1`
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 10px;
    width: 100%;
    max-width: 300px;
    border-radius: 4px;
    border: 1px solid ${colors.border};
    margin-bottom: 20px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: ${colors.primary};
    color: ${colors.lightText};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    &:hover {
      background-color: ${colors.hover};
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

const vaquinhaAbi = [
  "function withdraw(uint vaquinhaId) public",
  "function getCreator(uint vaquinhaId) public view returns (address)",
];

const ManageVakinha: React.FC<{ vaquinhaId: number }> = ({ vaquinhaId }) => {
  const { address: userAddress, isConnected } = useAccount();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [creatorAddress, setCreatorAddress] = useState<string | null>(null);

  const vaquinhaAddress = "0xYourContractAddressHere"; // Substitua pelo endereço do seu contrato

  useEffect(() => {
    const fetchCreatorAddress = async () => {
      if (!isConnected || !userAddress) return;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const vaquinhaContract = new ethers.Contract(vaquinhaAddress, vaquinhaAbi, provider);

        const creator = await vaquinhaContract.getCreator(vaquinhaId);
        setCreatorAddress(creator);
      } catch (error) {
        setErrorMessage("Failed to fetch creator address: " + (error.message || "Unknown error"));
      }
    };

    fetchCreatorAddress();
  }, [vaquinhaId, isConnected, userAddress]);

  const handleWithdraw = async () => {
    try {
      if (!isConnected || !userAddress) {
        setErrorMessage("Connect your wallet to proceed.");
        return;
      }

      if (creatorAddress?.toLowerCase() !== userAddress.toLowerCase()) {
        setErrorMessage("You are not authorized to withdraw from this Vakinha.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const vaquinhaContract = new ethers.Contract(vaquinhaAddress, vaquinhaAbi, signer);
      const tx = await vaquinhaContract.withdraw(vaquinhaId);

      await tx.wait();

      setSuccessMessage("Withdrawal successful!");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Withdrawal failed: " + (error.message || "Unknown error"));
      setSuccessMessage(null);
    }
  };

  return (
    <Container>
      <Heading>Gerencie sua Vakinha</Heading>
      <p>Vakinha ID: {vaquinhaId} </p>
      {creatorAddress && <p>Creator Address: {creatorAddress}</p>}
      <label htmlFor="withdrawAmount">Withdraw Amount:</label>
      <input
        type="number"
        id="withdrawAmount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
      />
      <Button onClick={handleWithdraw}>Withdraw</Button>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </Container>
  );
};

export default ManageVakinha;
