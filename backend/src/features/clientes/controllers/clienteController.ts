// Nome do arquivo: ./backend/src/features/clientes/controllers/clienteController.ts
// Finalidade: Controlador para operações de clientes.
import { Request, Response, NextFunction } from 'express';
import * as ClienteService from '../services/clienteService';
import { AppError } from '../../../utils/errorHandler';

interface Cliente {
  cpf: string;
  nome: string;
  email: string;
  created_at?: Date;
}

const getClienteByCpf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cpf } = req.params;
    if (!cpf || !/^\d{11}$/.test(cpf)) {
      throw new AppError('CPF inválido', 400);
    }
    const cliente = await ClienteService.getClienteByCpf(cpf);
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }
    res.status(200).json({ status: 'success', data: cliente });
  } catch (error) {
    res.status((error as AppError).statusCode || 500).json({ status: 'error', message: (error as Error).message });
  }
};

const getAllClientes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientes = await ClienteService.getAllClientes();
    res.status(200).json({
      status: 'success',
      message: 'Clientes recuperados com sucesso!',
      data: clientes
    });
  } catch (err) {
    next(err);
  }
};

const getNClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await ClienteService.getNClientes(page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar clientes paginados' });
  }
};

const createCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cpf, nome, email } = req.body;
    const cliente = await ClienteService.createCliente({ cpf, nome, email });
    res.status(201).json({
      status: 'success',
      message: 'Cliente criado com sucesso!',
      data: cliente
    });
  } catch (err: any) {
    if (err.code === '23505') {
      next(new AppError('CPF já cadastrado no sistema', 409));
      return;
    }
    next(new AppError(err.message || 'Falha ao criar cliente', err.statusCode || 500));
  }
};

const updateCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cpf } = req.params;
    const { nome, email } = req.body;
    const cliente = await ClienteService.updateCliente(cpf, { nome, email });
    if (!cliente) throw new AppError('Cliente não encontrado ou falha na atualização', 404);
    res.status(200).json({
      status: 'success',
      message: 'Cliente atualizado com sucesso!',
      data: cliente
    });
  } catch (err) {
    next(new AppError((err as Error).message || 'Falha ao atualizar cliente', (err as AppError).statusCode || 500));
  }
};

const deleteCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cpf } = req.params;
    await ClienteService.deleteCliente(cpf);
    res.status(204).json({
      status: 'success',
      message: 'Cliente deletado com sucesso!'
    });
  } catch (err) {
    next(err);
  }
};

export { getAllClientes, getNClientes, getClienteByCpf, createCliente, updateCliente, deleteCliente };
