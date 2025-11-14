// Nome do arquivo: ./backend/src/utils/errorHandler.ts
// Finalidade: Manipulador de erros para a aplicação.
// Manipulador de erros para a aplicação
import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'error';
  }
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  });
};

export { AppError, errorHandler };
