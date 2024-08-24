const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vaquinha", function () {
  let Vaquinha, vaquinha, owner, addr1, addr2;

  beforeEach(async function () {
    Vaquinha = await ethers.getContractFactory("Vaquinha");
    [owner, addr1, addr2] = await ethers.getSigners();
    vaquinha = await Vaquinha.deploy();
    await vaquinha.deployed();
  });

  it("Deve criar uma nova vaquinha", async function () {
    await vaquinha.createVaquinha("Test Vaquinha", 100, 30);
    const vaquinhaInfo = await vaquinha.getVaquinha(0);

    expect(vaquinhaInfo.nome).to.equal("Test Vaquinha");
    expect(vaquinhaInfo.objetivo).to.equal(100);
    expect(vaquinhaInfo.ativa).to.be.true;
  });

  it("Deve permitir contribuições", async function () {
    await vaquinha.createVaquinha("Test Vaquinha", 100, 30);

    await vaquinha.connect(addr1).contribute(0, { value: ethers.utils.parseEther("1") });
    const vaquinhaInfo = await vaquinha.getVaquinha(0);

    expect(ethers.utils.formatEther(vaquinhaInfo.saldo)).to.equal("1.0");
  });

  it("Deve permitir que o criador saque os fundos após atingir o objetivo", async function () {
    await vaquinha.createVaquinha("Test Vaquinha", ethers.utils.parseEther("1"), 30);

    await vaquinha.connect(addr1).contribute(0, { value: ethers.utils.parseEther("1") });

    // Saldo inicial do criador
    const initialBalance = await ethers.provider.getBalance(owner.address);

    // Realiza o saque
    await vaquinha.withdraw(0);

    // Saldo final do criador
    const finalBalance = await ethers.provider.getBalance(owner.address);

    // O saldo final deve ser maior que o saldo inicial
    expect(finalBalance).to.be.gt(initialBalance);
  });

  it("Deve falhar ao tentar sacar antes de atingir o objetivo ou tempo", async function () {
    await vaquinha.createVaquinha("Test Vaquinha", ethers.utils.parseEther("10"), 30);

    await vaquinha.connect(addr1).contribute(0, { value: ethers.utils.parseEther("1") });

    await expect(vaquinha.withdraw(0)).to.be.revertedWith("Meta nao atingida e ainda dentro do prazo de duracao.");
  });

  it("Deve permitir o saque após o término da duração", async function () {
    await vaquinha.createVaquinha("Test Vaquinha", ethers.utils.parseEther("10"), 1); // 1 dia

    await vaquinha.connect(addr1).contribute(0, { value: ethers.utils.parseEther("1") });

    // Avança o tempo em 1 dia
    await ethers.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    // Agora o saque deve ser permitido
    await vaquinha.withdraw(0);
    const vaquinhaInfo = await vaquinha.getVaquinha(0);
    expect(vaquinhaInfo.saldo).to.equal(0);
  });

  it("Deve permitir múltiplas contribuições", async function () {
    await vaquinha.createVaquinha("Test Vaquinha", ethers.utils.parseEther("10"), 30);

    await vaquinha.connect(addr1).contribute(0, { value: ethers.utils.parseEther("1") });
    await vaquinha.connect(addr2).contribute(0, { value: ethers.utils.parseEther("2") });

    const vaquinhaInfo = await vaquinha.getVaquinha(0);
    expect(ethers.utils.formatEther(vaquinhaInfo.saldo)).to.equal("3.0");
  });

  it("Deve falhar ao tentar contribuir para uma vaquinha inativa", async function () {
    await vaquinha.createVaquinha("Test Vaquinha", ethers.utils.parseEther("10"), 1); // 1 dia

    await vaquinha.connect(addr1).contribute(0, { value: ethers.utils.parseEther("1") });

    // Avança o tempo em 1 dia para expirar a vaquinha
    await ethers.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    // Realiza o saque para encerrar a vaquinha
    await vaquinha.withdraw(0);

    // Agora, tentar contribuir deve falhar
    await expect(vaquinha.connect(addr2).contribute(0, { value: ethers.utils.parseEther("1") })).to.be.revertedWith("Vaquinha inativa");
  });
});
