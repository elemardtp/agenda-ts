// Nome do arquivo: ./frontend/src/pages/Procedimentos.tsx
// Finalidade: Componente React para manutenção de procedimentos no frontend.
import React, { useState, useEffect, useRef } from 'react';
import { getProcedimentos, createProcedimento, updateProcedimento } from '../services/api';
import '@govbr-ds/webcomponents-react'; // Importa wrappers React

interface Procedimento {
  id: number;
  nome: string;
  tempo_estimado: number;
  descricao?: string;
}

const Procedimentos = () => {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalProcedimento, setModalProcedimento] = useState<Procedimento>({ id: 0, nome: '', tempo_estimado: 0, descricao: '' });
  const [isEdit, setIsEdit] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProcedimentos();
  }, []);

  const fetchProcedimentos = async () => {
    const data = await getProcedimentos();
    setProcedimentos(data);
  };

  const openModal = (procedimento?: Procedimento) => {
    setModalProcedimento(procedimento || { id: 0, nome: '', tempo_estimado: 0, descricao: '' });
    setIsEdit(!!procedimento);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await updateProcedimento(modalProcedimento.id, modalProcedimento);
    } else {
      await createProcedimento(modalProcedimento);
    }
    closeModal();
    fetchProcedimentos();
  };

  return (
    <div>
      <h1>Manutenção de Procedimentos</h1>
      <br-button emphasis="primary" onClick={() => openModal()}>Adicionar Procedimento</br-button>
      <table className="fr-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tempo Estimado</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {procedimentos.map((procedimento) => (
            <tr key={procedimento.id}>
              <td>{procedimento.nome}</td>
              <td>{procedimento.tempo_estimado}</td>
              <td>{procedimento.descricao}</td>
              <td>
                <br-button emphasis="primary" onClick={() => openModal(procedimento)}>
                  Editar
                </br-button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div ref={modalRef} className="fr-modal" role="dialog" aria-label={isEdit ? 'Editar Procedimento' : 'Adicionar Procedimento'}>
          <form onSubmit={handleSubmit}>
            <label>
              Nome:
              <input
                value={modalProcedimento.nome}
                onChange={(e) => setModalProcedimento({ ...modalProcedimento, nome: e.target.value })}
                required
              />
            </label>
            <label>
              Tempo Estimado (min):
              <input
                type="number"
                value={modalProcedimento.tempo_estimado}
                onChange={(e) => setModalProcedimento({ ...modalProcedimento, tempo_estimado: parseInt(e.target.value) })}
                required
              />
            </label>
            <label>
              Descrição:
              <textarea
                value={modalProcedimento.descricao}
                onChange={(e) => setModalProcedimento({ ...modalProcedimento, descricao: e.target.value })}
              />
            </label>
            <br-button type="submit">{isEdit ? 'Salvar' : 'Criar'}</br-button>
            <br-button onClick={closeModal}>Cancelar</br-button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Procedimentos;
