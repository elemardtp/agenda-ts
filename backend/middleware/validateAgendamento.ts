// Nome do arquivo: ./backend/middleware/validateAgendamento.ts
// Finalidade: Middleware de validação para agendamentos.
import Joi from 'joi';
import { AppError } from '../src/utils/errorHandler';
import { Request, Response, NextFunction } from 'express';

const validateAgendamento = (method: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (method === 'create') {
        const schema = Joi.object({
          clienteCpf: Joi.string().length(11).pattern(/^\d+$/).required(),
          procedimentoIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
          dataHora: Joi.date().iso().required()
        });
        await schema.validateAsync(req.body);
      } else if (method === 'getAll') {
        const schema = Joi.object({
          page: Joi.number().integer().min(1).optional(),
          limit: Joi.number().integer().min(1).optional()
        });
        await schema.validateAsync(req.query);
      } else if (method === 'getTimeWindows') {
        const schema = Joi.object({
          data: Joi.date().iso().required(),
          procedimentoIds: Joi.array().items(Joi.number().integer().positive()).min(1).required()
        });
        await schema.validateAsync(req.body);
      } else if (method === 'delete') {
        const schema = Joi.object({
          id: Joi.number().integer().positive().required()
        });
        await schema.validateAsync(req.params);
      } else {
        return next(new AppError('Método de validação inválido', 400));
      }
      next();
    } catch (error) {
      next(new AppError((error as Error).message || 'Erro na validação', 400));
    }
  };
};

export default validateAgendamento;
