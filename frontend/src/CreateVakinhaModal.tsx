import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CreateVakinhaModalProps {
  onClose: () => void;
  onCreate: (nome: string, descricao: string, objetivo: number, duracao: number) => Promise<number>; // Supondo que retorne o id da Vakinha criada
}

const CreateVakinhaModal: React.FC<CreateVakinhaModalProps> = ({ onClose, onCreate }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [duracao, setDuracao] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (nome && descricao && objetivo && duracao) {
      const vakinhaId = await onCreate(nome, descricao, Number(objetivo), Number(duracao));

      // Navega para a página de gerenciamento passando o estado com as informações
      navigate(`/manage-vakinha/${vakinhaId}`, {
        state: { descricao },
      });

      onClose();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Criar Nova Vakinha</h2>
        <input
          type="text"
          placeholder="Nome da Vakinha"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Descrição da Vakinha"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="number"
          placeholder="Objetivo (em ETH)"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Duração (em dias)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          style={styles.input}
        />
        <div style={styles.actions}>
          <button onClick={handleSubmit} style={styles.button}>
            Criar Vakinha
          </button>
          <button onClick={onClose} style={styles.button}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
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
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center" as "center",
  },
  input: {
    width: "80%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
  },
  textarea: {
    width: "80%",
    padding: "10px",
    height: "80px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
    resize: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  },
};

export default CreateVakinhaModal;
