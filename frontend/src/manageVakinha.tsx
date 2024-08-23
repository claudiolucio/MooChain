import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
    color: ${colors.text};
`;

const Input = styled.input`
    padding: 10px;
    width: 70%;
    border-radius: 4px;
    border: 1px solid ${colors.border};
    margin-bottom: 20px;
    margin-right: 10px;
    font-size: 16px;
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

const vaquinhaAbi = [
    "function withdraw(uint vaquinhaId) public",
    "function getCreator(uint vaquinhaId) public view returns (address)",
    "function getTotalRaised(uint vaquinhaId) public view returns (uint256)",
];

const ManageVakinha: React.FC<{ vaquinhaId: number, walletAddress: string }> = ({ vaquinhaId, walletAddress }) => {
    const { address: userAddress, isConnected } = useAccount();
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [creatorAddress, setCreatorAddress] = useState<string | null>(null);
    const [totalRaised, setTotalRaised] = useState<number>(0);

    const navigate = useNavigate();
    const vaquinhaAddress = walletAddress;

    useEffect(() => {
        const fetchData = async () => {
            if (!isConnected || !userAddress) return;

            try {
                if (typeof window.ethereum === "undefined") {
                    setErrorMessage("MetaMask is not installed. Please install it to use this feature.");
                    return;
                }

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const vaquinhaContract = new ethers.Contract(vaquinhaAddress, vaquinhaAbi, provider);

                const creator = await vaquinhaContract.getCreator(vaquinhaId);
                setCreatorAddress(creator);

                const raised = await vaquinhaContract.getTotalRaised(vaquinhaId);
                setTotalRaised(Number(ethers.utils.formatEther(raised)));
            } catch (error) {
                setErrorMessage("Failed to fetch data: " + (error as Error).message);
            }
        };

        fetchData();
    }, [vaquinhaId, isConnected, userAddress, vaquinhaAddress]);

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
            setErrorMessage("Withdrawal failed: " + (error as Error).message);
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
                {creatorAddress && <p>Creator Address: {creatorAddress}</p>}
                <p><strong>Valor Arrecadado:</strong> {totalRaised} ETH</p>
                <Label htmlFor="withdrawAmount">Valor do saque:</Label>
                <Input
                    type="number"
                    id="withdrawAmount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                />
                <Button onClick={handleWithdraw}>Sacar</Button>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            </Card>
        </Container>
    );
};

export default ManageVakinha;
