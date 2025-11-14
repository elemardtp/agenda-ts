// Nome do arquivo: ./backend/src/features/procedimentos/services/procedimentoService.ts
// Finalidade: Serviço para operações de procedimentos.
import ProcedimentoModel from '../models/procedimentoModel';
import { AppError } from '../../../utils/errorHandler';

interface Procedimento {
  id: number;
  nome: string;
  tempo_estimado: number;
  descricao?: string;
}

const getAllProcedimentos = async (): Promise<Procedimento[]> => {
  const procedimentos = await ProcedimentoModel.getAll();
  return procedimentos;
};

const getProcedimentoById = async (id: number): Promise<Procedimento> => {
  const procedimento = await ProcedimentoModel.getById(id);
  if (!procedimento) {
    throw new AppError('Procedimento não encontrado', 404);
  }
  return procedimento;
};

const createProcedimento = async (data: { nome: string; tempoEstimado: number }): Promise<Procedimento> => {
  const procedimento = await ProcedimentoModel.create(data.nome, data.tempoEstimado);
  return procedimento;
};

const updateProcedimento = async (id: number, data: { nome: string; tempoEstimado: number; descricao?: string }): Promise<Procedimento> => {
  const procedimento = await ProcedimentoModel.getById(id);
  if (!procedimento) {
    throw new AppError('Procedimento não encontrado', 404);
  }
  const updatedProcedimento = await ProcedimentoModel.update(id, data.nome, data.tempoEstimado, data.descricao);
  return updatedProcedimento;
};

export { getAllProcedimentos, getProcedimentoById, createProcedimento, updateProcedimento };
