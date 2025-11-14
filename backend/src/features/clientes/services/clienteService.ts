// ./backend/src/features/clientes/services/clienteService.ts
// Serviço para operações de clientes
import ClienteModel from '../models/clienteModel'; // Ajustado para import ES6
import { AppError } from '../../../utils/errorHandler';
import { Pool } from 'pg'; // Assumindo que database.js exporta Pool

let pool: Pool | null = null;
try {
  pool = require('../../../config/database') as Pool;
} catch (err) {
  pool = null;
}

interface Cliente {
  cpf: string;
  nome: string;
  email: string;
  created_at?: Date;
}

interface PaginatedClientes {
  data: Cliente[];
  total: number;
}

const getAllClientes = async (): Promise<Cliente[]> => {
  const clientes = await ClienteModel.getAll();
  return clientes;
};

const getNClientes = async (page: number = 1, limit: number = 10): Promise<PaginatedClientes> => {
  if (!pool) {
    throw new Error('Pool de banco de dados não inicializado - verifique config/database.js');
  }
  const offset = (page - 1) * limit;
  const { rows: data } = await pool.query<Cliente>(
    'SELECT cpf, nome, email, created_at FROM clientes ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  const { rows: [{ count }] } = await pool.query<{ count: string }>('SELECT COUNT(*) FROM clientes');
  return { data, total: parseInt(count) };
};

const getClienteByCpf = async (cpf: string): Promise<Cliente> => {
  const cliente = await ClienteModel.getByCpf(cpf);
  if (!cliente) throw new AppError('Cliente não encontrado', 404);
  return cliente;
};

const createCliente = async (data: { cpf: string; nome: string; email: string }): Promise<Cliente> => {
  const cliente = await ClienteModel.create(data.cpf, data.nome, data.email);
  if (!cliente) throw new AppError('Falha ao criar cliente', 500);
  return cliente;
};

const updateCliente = async (cpf: string, data: { nome: string; email: string }): Promise<Cliente> => {
  const cliente = await ClienteModel.update(cpf, data.nome, data.email);
  if (!cliente) throw new AppError('Cliente não encontrado ou falha na atualização', 404);
  return cliente;
};

const deleteCliente = async (cpf: string): Promise<boolean> => {
  const result = await ClienteModel.delete(cpf);
  if (!result) throw new AppError('Cliente não encontrado ou falha na exclusão', 404);
  return result;
};

export { getAllClientes, getNClientes, getClienteByCpf, createCliente, updateCliente, deleteCliente };
