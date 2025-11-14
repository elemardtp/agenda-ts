// Nome do arquivo: ./backend/src/features/funcionarios/services/funcionarioService.ts
// Finalidade: Serviço para operações de funcionários.
import FuncionarioModel from '../models/funcionarioModel';
import { AppError } from '../../../utils/errorHandler';

interface Funcionario {
  id: number;
  nome: string;
  username: string;
  role: string;
  email: string;
  password?: string;
  created_at?: Date;
}

const createFuncionario = async (data: { nome: string; username: string; password: string; role: string; email: string }): Promise<Funcionario> => {
  const funcionario = await FuncionarioModel.create(data.username, data.password, data.role, data.nome, data.email);
  if (!funcionario) throw new AppError('Falha ao criar funcionário', 500);
  return funcionario;
};

const getAllFuncionarios = async (): Promise<Funcionario[]> => {
  const funcionarios = await FuncionarioModel.getAll(); // Assumindo que você adicionou getAll no model
  return funcionarios;
};

const getFuncionarioById = async (id: number): Promise<Funcionario> => {
  const funcionario = await FuncionarioModel.getById(id); // Assumindo que você adicionou getById no model
  if (!funcionario) throw new AppError('Funcionário não encontrado', 404);
  return funcionario;
};

const updateFuncionario = async (id: number, data: { nome: string; username: string; password: string; role: string; email: string }): Promise<Funcionario> => {
  const funcionario = await FuncionarioModel.update(id, data.nome, data.username, data.password, data.role, data.email); // Assumindo que você adicionou update no model
  if (!funcionario) throw new AppError('Funcionário não encontrado ou falha na atualização', 404);
  return funcionario;
};

export { createFuncionario, getAllFuncionarios, getFuncionarioById, updateFuncionario };
