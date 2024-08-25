import { useReadVaquinhaVaquinhas } from "./generated";

const RenderVaquinhasById = ({ vaquinhaId, contractAddress }: { vaquinhaId: number; contractAddress: string }) => {
  const { data: vaquinhasFromContract } = useReadVaquinhaVaquinhas({
    address: contractAddress as `0x${string}`,
    args: [BigInt(vaquinhaId)],
  });

  if (!vaquinhasFromContract) return <p>Essa vaquinha nao foi encontrada</p>;
  return (
    <div>
      <h3>Nome: {vaquinhasFromContract[0]}</h3>
      <h3>Criador: {vaquinhasFromContract[1]}</h3>
      <h3>Objetivo: {vaquinhasFromContract[2].toString()}</h3>
      <h3>Saldo: {vaquinhasFromContract[3].toString()}</h3>
      <h3>Data de criação: {vaquinhasFromContract[4].toString()}</h3>
      <h3>Duração: {vaquinhasFromContract[5].toString()}</h3>
      <h3>Ativa: {vaquinhasFromContract[6]}</h3>
    </div>
  );
};

export default RenderVaquinhasById;
