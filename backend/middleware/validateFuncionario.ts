// Nome do arquivo: ./backend/middleware/validateFuncionario.ts
// Finalidade: Middleware de validação para funcionários.
import Joi from 'joi';
import { AppError } from '../src/utils/errorHandler';
import { cpf } from 'cpf-cnpj-validator';
import { Request, Response, NextFunction } from 'express';

const validateFuncionario = (method: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (method === 'create') {
        const schema = Joi.object({
          nome: Joi.string().required(),
          username: Joi.string().required(),
          password: Joi.string().required(),
          role: Joi.string().required(),
          email: Joi.string().email().required()
        });
        await schema.validateAsync(req.body);
      } // Adicione outras validações se necessário
      next();
    } catch (error) {
      next(new AppError((error as Error).message || 'Erro na validação', 400));
    }
  };
};

export default validateFuncionario;
