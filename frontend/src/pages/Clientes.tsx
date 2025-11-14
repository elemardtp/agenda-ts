// Nome do arquivo: ./frontend/src/pages/Clientes.tsx
// Finalidade: Componente React para manutenção de clientes no frontend (versão mesclada: listagem paginada básica com CRUD completo, modais, validações, auth handling e UI GovBR).

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isValidCpf } from '../utils/formatCpf';
import { getNClientes, deleteCliente, createCliente, updateCliente } from '../services/api'; // Mesclado: usa getNClientes para paginação consistente com V1
import { Cliente } from '../services/api';
import '@govbr-ds/webcomponents-react';  // Registro dos web components

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalCliente, setModalCliente] = useState<Cliente>({ cpf: '', nome: '', email: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClientes();
  }, [page]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) closeModal();
    };
    if (showModal) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token antes de GET clientes:', token ? 'Presente' : 'Ausente');
      if (!token) {
        console.log('401 detectado: Token inválido/expirado');
        toast.error('Sessão expirada. Redirecionando para login...');
        localStorage.clear();
        navigate('/login');
        return;
      }
      const response = await getNClientes(page); // Mesclado: usa getNClientes da V1 para paginação
      setClientes(response.data);
      setTotal(response.total);
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error);
      if (error.response?.status === 401) {
        console.log('401 detectado: Token inválido/expirado');
        toast.error('Sessão expirada. Redirecionando para login...');
        localStorage.clear();
        navigate('/login');
        return;
      }
      toast.error('Falha ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cliente?: Cliente) => {
    if (cliente) {
      setModalCliente(cliente);
      setIsEdit(true);
    } else {
      setModalCliente({ cpf: '', nome: '', email: '' });
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalCliente({ cpf: '', nome: '', email: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCpf(modalCliente.cpf)) {
      toast.error('CPF inválido');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(modalCliente.email)) {
      toast.error('Email inválido');
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await updateCliente(modalCliente.cpf, { nome: modalCliente.nome, email: modalCliente.email });
        toast.success('Cliente atualizado!');
      } else {
        await createCliente(modalCliente);
        toast.success('Cliente criado!');
      }
      closeModal();
      fetchClientes();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cpfDel: string) => {
    if (window.confirm('Confirma exclusão do cliente?')) {
      try {
        await deleteCliente(cpfDel);
        toast.success('Cliente excluído!');
        fetchClientes();
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Falha na exclusão');
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(total / limit)) return;
    setPage(newPage);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;

    return (
      <div className="fr-pagination fr-mt-2w fr-col-12 fr-display-flex fr-justify-content-center fr-align-items-center">
        <br-button emphasis="secondary" disabled={page === 1} onClick={() => handlePageChange(page - 1)} className="fr-mr-1w">
          Anterior
        </br-button>
        <span className="fr-mx-1w">Página {page} de {totalPages}</span>
        <br-button emphasis="secondary" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
          Próxima
        </br-button>
      </div>
    );
  };

  if (loading) return <div className="fr-container fr-mt-2w">Carregando...</div>;

  return (
    <div className="fr-container fr-mt-2w fr-pb-2w">
      <div className="fr-grid-row fr-col-12">
        <h1 className="fr-h1">Manutenção de Clientes</h1>
        <br-button emphasis="primary" onClick={() => openModal()} className="fr-mb-1w">
          Adicionar Cliente
        </br-button>

        <div className="fr-table-wrapper fr-col-12">
          <table className="fr-table fr-table--bordered">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.cpf}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.cpf}</td>
                  <td>
                    <br-button emphasis="primary" size="sm" onClick={() => openModal(cliente)} className="fr-mr-1w">
                      Editar
                    </br-button>
                    <br-button emphasis="secondary" size="sm" onClick={() => handleDelete(cliente.cpf)}>
                      Excluir
                    </br-button>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={4} className="fr-text-center fr-py-2w">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {renderPagination()}
      </div>

      {showModal && (
        <div
          ref={modalRef}
          className="fr-overlay fr-modal-overlay"
          role="dialog"
          aria-label={isEdit ? 'Editar Cliente' : 'Adicionar Cliente'}
          aria-modal="true"
          onClick={(e) => e.target === modalRef.current && closeModal()}
        >
          <div className="fr-modal fr-col-8 fr-mx-auto fr-mt-4w fr-p-2w">
            <div className="fr-display-flex fr-justify-content-between fr-align-items-center fr-mb-2w">
              <h2 className="fr-h2">{isEdit ? 'Editar Cliente' : 'Adicionar Cliente'}</h2>
              <button className="fr-btn fr-btn--close" onClick={closeModal} aria-label="Fechar">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="fr-fieldset fr-mb-2w">
                <label className="fr-label" htmlFor="nome">Nome</label>
                <input id="nome" className="fr-input fr-col-12" value={modalCliente.nome} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModalCliente({ ...modalCliente, nome: e.target.value })} required />
              </div>
              <div className="fr-fieldset fr-mb-2w">
                <label className="fr-label" htmlFor="email">Email</label>
                <input id="email" type="email" className="fr-input fr-col-12" value={modalCliente.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModalCliente({ ...modalCliente, email: e.target.value })} required />
              </div>
              <div className="fr-fieldset fr-mb-2w">
                <label className="fr-label" htmlFor="cpf">CPF</label>
                <input id="cpf" className="fr-input fr-col-12" value={modalCliente.cpf} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModalCliente({ ...modalCliente, cpf: e.target.value })} disabled={isEdit} required />
              </div>
              <div className="fr-display-flex fr-justify-content-end fr-mt-2w">
                <br-button emphasis="primary" type="submit" disabled={saving} className="fr-mr-1w">
                  {saving ? 'Salvando...' : 'Salvar'}
                </br-button>
                <br-button emphasis="tertiary" onClick={closeModal} disabled={saving}>
                  Cancelar
                </br-button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
