// Nome do arquivo: ./backend/src/features/funcionarios/controllers/funcionarioController.ts
// Finalidade: Controlador para operações de funcionários.
import { Request, Response, NextFunction } from 'express';
import * as FuncionarioService from '../services/funcionarioService';
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

const getAllFuncionarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const funcionarios = await FuncionarioService.getAllFuncionarios();
    res.status(200).json({
      status: 'success',
      message: 'Funcionários recuperados com sucesso!',
      data: funcionarios
    });
  } catch (err) {
    res.status((err as AppError).statusCode || 500).json({ status: 'error', message: (err as Error).message });
  }
};

const getFuncionarioById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const funcionario = await FuncionarioService.getFuncionarioById(parseInt(id));
    res.status(200).json({
      status: 'success',
      message: 'Funcionário recuperado com sucesso!',
      data: funcionario
    });
  } catch (err) {
    res.status((err as AppError).statusCode || 500).json({ status: 'error', message: (err as Error).message });
  }
};

const createFuncionario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome, username, password, role, email } = req.body;
    const funcionario = await FuncionarioService.createFuncionario({ nome, username, password, role, email });
    res.status(201).json({
      status: 'success',
      message: 'Funcionário criado com sucesso!',
      data: funcionario
    });
  } catch (err) {
    res.status((err as AppError).statusCode || 500).json({ status: 'error', message: (err as Error).message });
  }
};

const updateFuncionario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, username, password, role, email } = req.body;
    const funcionario = await FuncionarioService.updateFuncionario(parseInt(id), { nome, username, password, role, email });
    res.status(200).json({
      status: 'success',
      message: 'Funcionário atualizado com sucesso!',
      data: funcionario
    });
  } catch (err) {
    res.status((err as AppError).statusCode || 500).json({ status: 'error', message: (err as Error).message });
  }
};

export { getAllFuncionarios, getFuncionarioById, createFuncionario, updateFuncionario };
