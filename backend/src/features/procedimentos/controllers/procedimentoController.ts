// Nome do arquivo: ./backend/src/features/procedimentos/controllers/procedimentoController.ts
// Finalidade: Controlador para operações de procedimentos.
import { Request, Response, NextFunction } from 'express';
import * as ProcedimentoService from '../services/procedimentoService';

interface Procedimento {
  id: number;
  nome: string;
  tempo_estimado: number;
  descricao?: string;
}

const getAllProcedimentos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const procedimentos = await ProcedimentoService.getAllProcedimentos();
    res.status(200).json({
      status: 'success',
      message: 'Procedimentos recuperados com sucesso!',
      data: procedimentos
    });
  } catch (err) {
    next(err);
  }
};

const getProcedimentoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const procedimento = await ProcedimentoService.getProcedimentoById(parseInt(req.params.id));
    res.status(200).json({
      status: 'success',
      message: 'Procedimento recuperado com sucesso!',
      data: procedimento
    });
  } catch (err) {
    next(err);
  }
};

const createProcedimento = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const procedimento = await ProcedimentoService.createProcedimento(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Procedimento criado com sucesso!',
      data: procedimento
    });
  } catch (err) {
    next(err);
  }
};

const updateProcedimento = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, tempoEstimado, descricao } = req.body;
    const procedimento = await ProcedimentoService.updateProcedimento(parseInt(id), { nome, tempoEstimado, descricao });
    res.status(200).json({
      status: 'success',
      message: 'Procedimento atualizado com sucesso!',
      data: procedimento
    });
  } catch (err) {
    next(err);
  }
};

export { getAllProcedimentos, getProcedimentoById, createProcedimento, updateProcedimento };
