// Nome do arquivo: ./backend/src/features/agendamentos/controllers/getAllAgendamentos.ts
// Finalidade: Controlador para obter todos os agendamentos.
import { Request, Response, NextFunction } from 'express';
import * as AgendamentoService from '../services/agendamentoService';

const getAllAgendamentos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const agendamentos = await AgendamentoService.getAllAgendamentos();
    res.json({ message: 'Agendamentos recuperados com sucesso!', data: agendamentos });
  } catch (error) {
    next(error);
  }
};

export { getAllAgendamentos };
