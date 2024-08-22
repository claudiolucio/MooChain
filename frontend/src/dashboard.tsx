import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ethers } from "ethers";
import CreateVakinhaModal from "./CreateVakinhaModal";

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

const styles = {
  container: {
    padding: "20px",
    backgroundColor: colors.background,
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: colors.darkBackground,
    borderRadius: "8px",
    color: colors.lightText,
  },
  heading: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: colors.primary,
    color: colors.lightText,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontSize: "16px",
  },
  section: {
    width: "100%",
    maxWidth: "800px",
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: colors.cardBackground,
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  walletInfo: {
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  searchSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  searchInput: {
    padding: "15px",
    width: "100%",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    marginBottom: "10px",
    fontSize: "16px",
    maxWidth: "600px",
  },
  vakinhaList: {
    width: "100%",
    maxWidth: "800px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
  vakinhaCard: {
    backgroundColor: colors.cardBackground,
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    textAlign: "center",
  },
  vakinhaCardHover: {
    transform: "scale(1.05)",
    boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
  },
  vakinhaTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  vakinhaDescription: {
    color: colors.text,
    fontSize: "16px",
    maxHeight: "40px", // Limita a altura para cerca de duas linhas de texto
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2, // Limita a exibição a 2 linhas
    WebkitBoxOrient: "vertical",
    lineHeight: "1.5", // Ajusta a altura da linha para melhor visualização
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  modalInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: `1px solid ${colors.border}`,
  },
  modalTextArea: {
    width: "100%",
    padding: "10px",
    height: "80px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: `1px solid ${colors.border}`,
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-around",
  },
};

const Dashboard = () => {
  const { logout } = useAuth0();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vakinhaList, setVakinhaList] = useState([
    { id: 1, nome: "Vakinha 1", descricao: "Ajude a Vakinha 1" },
    { id: 2, nome: "Vakinha 2", descricao: "Ajude a Vakinha 2" },
  ]);
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredVakinhas = vakinhaList.filter((vakinha) =>
    vakinha.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Erro ao conectar a MetaMask", error);
      }
    } else {
      alert("MetaMask não encontrada. Instale a extensão.");
    }
  };

  const createVakinhaOnBlockchain = (nome: string, descricao: string, objetivo: number, duracao: number) => {
    const newVakinha = {
      id: vakinhaList.length + 1,
      nome,
      descricao,
    };
    setVakinhaList([...vakinhaList, newVakinha]);
    console.log("Vakinha criada:", { nome, descricao, objetivo, duracao });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Vakinha Blockchain</h1>
        <button
          style={styles.button}
          onClick={() => logout()}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
        >
          Logout
        </button>
      </header>

      <section style={styles.section}>
        {walletAddress ? (
          <div>
            <p style={styles.walletInfo}>Carteira conectada: {walletAddress}</p>
            <button
              style={styles.button}
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Criar Nova Vakinha
            </button>
          </div>
        ) : (
          <button
            style={styles.button}
            onClick={connectWallet}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
          >
            Conectar MetaMask
          </button>
        )}
      </section>

      <section style={{ ...styles.section, ...styles.searchSection }}>
        <input
          type="text"
          placeholder="Pesquisar vakinhas..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </section>

      <section style={styles.vakinhaList}>
        {filteredVakinhas.length > 0 ? (
          filteredVakinhas.map((vakinha) => (
            <div
              key={vakinha.id}
              style={{
                ...styles.vakinhaCard,
                ...(hoverCard === vakinha.id ? styles.vakinhaCardHover : {}),
              }}
              onMouseEnter={() => setHoverCard(vakinha.id)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <h3 style={styles.vakinhaTitle}>{vakinha.nome}</h3>
              <p style={styles.vakinhaDescription}>{vakinha.descricao}</p>
            </div>
          ))
        ) : (
          <p>Nenhuma vakinha encontrada</p>
        )}
      </section>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <CreateVakinhaModal
            onClose={() => setIsModalOpen(false)}
            onCreate={createVakinhaOnBlockchain}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
