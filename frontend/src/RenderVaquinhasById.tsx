import { useNavigate } from "react-router-dom";
import { useReadVaquinhaVaquinhas } from "./generated";
import styled from "styled-components";

const RenderVaquinhasById = ({ vaquinhaId, contractAddress }: { vaquinhaId: number; contractAddress: string }) => {
  const { data: vaquinhasFromContract } = useReadVaquinhaVaquinhas({
    address: contractAddress as `0x${string}`,
    args: [BigInt(vaquinhaId)],
  });

  const navigate = useNavigate();

  if (!vaquinhasFromContract) return <p>Essa vaquinha não foi encontrada</p>;

  // Verifica se a vakinha está ativa ou se o saldo é maior que zero
  const saldo = BigInt(vaquinhasFromContract[4]);
  const ativa = vaquinhasFromContract[7];
  console.log(vaquinhasFromContract);

  if (saldo === 0n && !ativa) {
    return null; // Se a vakinha não tiver saldo ou não estiver ativa, não renderiza
  }

  const handleViewVakinha = () => {
    navigate(`/manage-vakinha/${vaquinhaId}`, { state: { descricao: vaquinhasFromContract[0] } });
  };

  return (
    <StyledCard>
      <CardHeader>
        <Title>{vaquinhasFromContract[0]}</Title> {/* Nome da vakinha */}
      </CardHeader>
      <CardBody>
        <Description>
          Criador: <span>{vaquinhasFromContract[2]}</span>
        </Description>
        <Info>
          Objetivo: <span>{vaquinhasFromContract[3].toString()} ETH</span>
        </Info>
        <Info>
          Saldo: <span>{vaquinhasFromContract[4].toString()} ETH</span>
        </Info>
      </CardBody>
      <CardFooter>
        <Button onClick={handleViewVakinha}>Ver Vakinha</Button>
      </CardFooter>
    </StyledCard>
  );
};

export default RenderVaquinhasById;

// Estilizações com styled-components

const StyledCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  max-width: 350px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  background-color: #4caf50;
  padding: 20px;
  color: #ffffff;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

const CardBody = styled.div`
  padding: 20px;
  background-color: #f7f9fc;
`;

const Description = styled.p`
  font-size: 16px;
  color: #333333;
  margin-bottom: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; /* Adiciona reticências */
  span {
    font-weight: bold;
    color: #4caf50;
  }
`;

const Info = styled.p`
  font-size: 16px;
  color: #555555;
  margin-bottom: 10px;
  span {
    font-weight: bold;
    color: #333333;
  }
`;

const CardFooter = styled.div`
  padding: 15px 20px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #388e3c;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #66bb6a;
  }
`;
