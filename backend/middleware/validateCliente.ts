// Nome do arquivo: ./backend/middleware/validateCliente.ts
// Finalidade: Middleware de validação para clientes.
import { cpf } from 'cpf-cnpj-validator';
import { AppError } from '../src/utils/errorHandler';
import { Request, Response, NextFunction } from 'express';

const validateCliente = (operation: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`Validando cliente para operação: ${operation}`, req.params, req.body);
    try {
      if (operation === 'getAll') {
        return next();
      }

      let cpfToValidate: string | undefined;
      if (operation === 'create') {
        cpfToValidate = req.body.cpf;
      } else if (['getByCpf', 'update', 'delete'].includes(operation)) {
        cpfToValidate = req.params.cpf;
      }

      if (!cpfToValidate) {
        throw new AppError('"cpf" é obrigatório', 400);
      }

      console.log(`CPF bruto: ${cpfToValidate}`);
      const sanitizedCpf = cpfToValidate.replace(/[^\d]/g, '');
      console.log(`Validando CPF: ${sanitizedCpf}, Resultado: ${cpf.isValid(sanitizedCpf)}`);

      const formattedCpf = cpf.format(sanitizedCpf);
      console.log(`CPF formatado: ${formattedCpf}, Resultado: ${cpf.isValid(formattedCpf)}`);

      if (!cpf.isValid(sanitizedCpf) && !cpf.isValid(formattedCpf)) {
        throw new AppError('"cpf" contém um valor inválido', 400);
      }

      if (['getByCpf', 'update', 'delete'].includes(operation)) {
        req.params.cpf = sanitizedCpf;
      } else if (operation === 'create') {
        req.body.cpf = sanitizedCpf;
      }

      next();
    } catch (error) {
      console.log('Erro na validação:', (error as Error).message);
      next(error);
    }
  };
};

export default validateCliente;
