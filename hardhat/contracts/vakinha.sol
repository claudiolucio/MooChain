// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vaquinha {
    struct VaquinhaInfo {
        string nome;
        string descricao; // Adicionando a descrição
        address payable criador;
        uint objetivo;
        uint saldo;
        uint dataCriacao;
        uint duracao;
        bool ativa;
    }

    VaquinhaInfo[] public vaquinhas;

    event VaquinhaCriada(
        uint vaquinhaId,
        string nome,
        string descricao,
        uint objetivo,
        uint duracao
    );
    event ContribuicaoRecebida(
        uint vaquinhaId,
        address contribuinte,
        uint valor
    );
    event SaqueRealizado(uint vaquinhaId, uint valor);
    event VaquinhaDeletada(uint vaquinhaId);

    // Função para criar uma nova vaquinha
    function createVaquinha(
        string memory nome,
        string memory descricao,
        uint objetivo,
        uint duracaoDias
    ) public {
        require(objetivo > 0, "O objetivo deve ser maior que 0");
        require(duracaoDias > 0, "A duracao deve ser maior que 0");

        vaquinhas.push(
            VaquinhaInfo({
                nome: nome,
                criador: payable(msg.sender),
                objetivo: objetivo,
                saldo: 0,
                dataCriacao: block.timestamp,
                duracao: duracaoDias * 1 days,
                ativa: true,
                descricao: descricao
            })
        );

        emit VaquinhaCriada(
            vaquinhas.length - 1,
            nome,
            descricao,
            objetivo,
            duracaoDias
        );
    }

    // Função para contribuir com uma vaquinha
    function contribute(uint vaquinhaId) public payable {
        require(vaquinhaId < vaquinhas.length, "Vaquinha inexistente");
        VaquinhaInfo storage vaquinha = vaquinhas[vaquinhaId];
        require(vaquinha.ativa, "Vaquinha inativa");

        vaquinha.saldo += msg.value;
        emit ContribuicaoRecebida(vaquinhaId, msg.sender, msg.value);
    }

    // Função para saque pelo criador da vaquinha
    function withdraw(uint vaquinhaId) public {
        require(vaquinhaId < vaquinhas.length, "Vaquinha inexistente");
        VaquinhaInfo storage vaquinha = vaquinhas[vaquinhaId];
        require(msg.sender == vaquinha.criador, "Apenas o criador pode sacar");
        require(vaquinha.saldo > 0, "Saldo insuficiente");
        require(vaquinha.ativa, "A vaquinha ja foi encerrada");

        // Condição 1: Meta atingida
        if (vaquinha.saldo >= vaquinha.objetivo) {
            realizarSaque(vaquinhaId);
        }
        // Condição 2: Tempo de duração atingido
        else if (block.timestamp >= vaquinha.dataCriacao + vaquinha.duracao) {
            realizarSaque(vaquinhaId);
        } else {
            revert("Meta nao atingida e ainda dentro do prazo de duracao.");
        }
    }

    // Função interna para realizar o saque
    function realizarSaque(uint vaquinhaId) internal {
        VaquinhaInfo storage vaquinha = vaquinhas[vaquinhaId];

        uint valor = vaquinha.saldo;
        vaquinha.saldo = 0;
        vaquinha.ativa = false;

        vaquinha.criador.transfer(valor);
        emit SaqueRealizado(vaquinhaId, valor);
    }

    // Função para deletar uma vaquinha
    function deleteVaquinha(uint vaquinhaId) public returns (uint) {
        require(vaquinhaId < vaquinhas.length, "Vaquinha inexistente");
        VaquinhaInfo storage vaquinha = vaquinhas[vaquinhaId];
        require(
            msg.sender == vaquinha.criador,
            "Apenas o criador pode deletar"
        );
        require(
            vaquinha.saldo == 0,
            "Vaquinha com saldo nao pode ser deletada"
        );

        // Marca a vaquinha como inativa para exclusão lógica
        vaquinha.ativa = false;

        emit VaquinhaDeletada(vaquinhaId);

        return 1; // Retorna 1 se a vaquinha foi deletada com sucesso
    }

    // Retorna a quantidade de vaquinhas criadas
    function getVaquinhaCount() public view returns (uint) {
        return vaquinhas.length;
    }

    // Retorna as informações de uma vaquinha específica
    function getVaquinha(
        uint vaquinhaId
    )
        public
        view
        returns (
            string memory,
            address,
            uint,
            uint,
            uint,
            uint,
            bool,
            string memory
        )
    {
        require(vaquinhaId < vaquinhas.length, "Vaquinha inexistente");
        VaquinhaInfo memory vaquinha = vaquinhas[vaquinhaId];
        return (
            vaquinha.nome,
            vaquinha.criador,
            vaquinha.objetivo,
            vaquinha.saldo,
            vaquinha.dataCriacao,
            vaquinha.duracao,
            vaquinha.ativa,
            vaquinha.descricao // Retorna a descrição
        );
    }
}
