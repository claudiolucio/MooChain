import hre from "hardhat";

async function main() {
  // Aqui, estamos usando o Hardhat para fazer o deploy do contrato "Vaquinha"
  const vaquinha = await hre.viem.deployContract("Vaquinha", [], {});

  console.log(`Vaquinha deployed to ${vaquinha.address}`);
}

// Recomendamos este padrão para permitir o uso de async/await em qualquer lugar
// e lidar adequadamente com erros.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
