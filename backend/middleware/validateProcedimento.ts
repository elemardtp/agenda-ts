// Nome do arquivo: ./backend/middleware/validateProcedimento.ts
// Finalidade: Middleware de validação para procedimentos.
import Joi from 'joi';
import { AppError } from '../src/utils/errorHandler';
import { Request, Response, NextFunction } from 'express';

const validateProcedimento = (method: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (method === 'create' || method === 'update') {
        const schema = Joi.object({
          nome: Joi.string().min(3).required(),
          tempoEstimado: Joi.number().integer().positive().required(),
          descricao: Joi.string().optional().allow('')
        });
        await schema.validateAsync(req.body);
      } else if (method === 'getById') {
        const schema = Joi.object({
          id: Joi.number().integer().positive().required()
        });
        await schema.validateAsync(req.params);
      } else if (method === 'getAll') {
        const schema = Joi.object({
          page: Joi.number().integer().min(1).optional(),
          limit: Joi.number().integer().min(1).optional()
        });
        await schema.validateAsync(req.query);
      } else {
        return next(new AppError('Método de validação inválido', 400));
      }
      next();
    } catch (error) {
      next(new AppError((error as Error).message || 'Erro na validação', 400));
    }
  };
};

export default validateProcedimento;
