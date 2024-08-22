import React, { useState } from "react";
import { ethers } from "ethers";

interface CreateVakinhaModalProps {
  onClose: () => void;
  onCreate: (nome: string, descricao: string, objetivo: number, duracao: number) => void;
}

const CreateVakinhaModal: React.FC<CreateVakinhaModalProps> = ({ onClose, onCreate }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [objetivo, setObjetivo] = useState<number | "">("");
  const [duracao, setDuracao] = useState<number | "">("");

  const handleSubmit = () => {
    if (nome && descricao && objetivo && duracao) {
      onCreate(nome, descricao, Number(objetivo), Number(duracao));
      onClose();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Criar Nova Vakinha</h2>
        <input
          type="text"
          placeholder="Nome da Vakinha"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={styles.modalInput}
        />
        <textarea
          placeholder="Descrição da Vakinha"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={styles.modalTextArea}
        />
        <input
          type="number"
          placeholder="Objetivo (em dinheiro)"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value as number)}
          style={styles.modalInput}
        />
        <input
          type="number"
          placeholder="Duração (em dias)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value as number)}
          style={styles.modalInput}
        />
        <div style={styles.modalActions}>
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

export default CreateVakinhaModal;
