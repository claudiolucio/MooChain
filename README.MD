# MooChain - Vakinha na Blockchain

Este é um projeto de aplicação descentralizada (dApp) chamado MooChain, onde os usuários podem criar e gerenciar vaquinhas na blockchain. Ele utiliza autenticação com o Auth0 para login e o Hardhat como framework para o desenvolvimento de contratos inteligentes.

No dado momento, o projeto está feito de forma a rodar localmente apenas.

### Tecnologias Utilizadas

1. **React:** Framework para construção da interface de usuário.
2. **Auth0:** Autenticação de usuários.
3. **RainbowKit:** Para conectar a carteira MetaMask.
4. **Hardhat:** Framework para desenvolvimento, teste e implantação de contratos inteligentes.
5. **Styled-components:** Estilização com CSS-in-JS.

## 1. Configurar o Ambiente de Desenvolvimento Local

### Backend (Contratos Inteligentes)

No terminal, execute

```bash
cd hardhat
npm install
npx hardhat node
```

No console do Hardhat, serão exibidos vários endereços de carteiras. Copie um ou dois deles para serem, usados no MetaMask.

### Configuração da Rede MetaMask

1. Abra o MetaMask no seu navegador.
2. Vá em "Adicionar Rede".
3. Configure uma nova rede com os seguintes detalhes:
   1. URL da RPC: ela será dada na linha de comando junto com os endereços de carteira. Espera-se algo como `http://127.0.0.1:8545/`.
   2. ID de Cadeia (Chain ID): 31337
   3. Conecte-se à rede local usando um dos endereços fornecidos pelo Hardhat.

### Frontend

_Abra um novo terminal e vá para o diretório frontend:_

```bash
cd ../frontend
npm install
npm run dev
```

## 2. Testando a Aplicação

Com o servidor de desenvolvimento em execução, você pode acessar a aplicação em `http://localhost:3000`. Faça o login com Auth0, conecte sua carteira MetaMask à rede local e comece a criar e gerenciar suas vaquinhas na blockchain.

## 3. Seja felz

Se tudo correu bem, você pode começar a criar vaquinhas ou contribuir com uma já existente com o MooChain!

## Observações

- Certifique-se de que o nó local do Hardhat esteja sempre em execução ao trabalhar com contratos inteligentes.

- Qualquer erro ou comportamento inesperado pode ser devido à falta de sincronização entre o contrato inteligente e a rede local. Certifique-se de que a carteira MetaMask esteja conectada corretamente.
