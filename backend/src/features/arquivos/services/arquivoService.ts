// Nome do arquivo: ./backend/src/features/arquivos/services/arquivoService.ts
// Finalidade: Serviço para operações de arquivos.
import pool from '../../../config/database';
import ClienteModel from '../../clientes/models/clienteModel';
import { AppError } from '../../../utils/errorHandler';
import path from 'path';
import fs from 'fs';

interface Arquivo {
  id: number;
  cliente_cpf: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  created_at: Date;
}

const uploadArquivo = async (cpf: string, originalname: string, size: number, filename: string, mimetype: string): Promise<Arquivo> => {
  const cliente = await ClienteModel.getByCpf(cpf);
  if (!cliente) {
    throw new AppError('Cliente não encontrado', 404);
  }
  const result = await pool.query(
    'INSERT INTO arquivos (cliente_cpf, filename, originalname, mimetype, size, path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [cpf, filename, originalname, mimetype, size, path.join('uploads', filename)]
  );
  return result.rows[0];
};

const getArquivosByCpf = async (cpf: string): Promise<Arquivo[]> => {
  const cliente = await ClienteModel.getByCpf(cpf);
  if (!cliente) {
    throw new AppError('Cliente não encontrado', 404);
  }
  const result = await pool.query('SELECT * FROM arquivos WHERE cliente_cpf = $1', [cpf]);
  return result.rows;
};

const getLatestArquivoByCpf = async (cpf: string): Promise<Arquivo | undefined> => {
  const cliente = await ClienteModel.getByCpf(cpf);
  if (!cliente) {
    throw new AppError('Cliente não encontrado', 404);
  }
  const result = await pool.query(
    'SELECT * FROM arquivos WHERE cliente_cpf = $1 ORDER BY created_at DESC LIMIT 1',
    [cpf]
  );
  return result.rows[0];
};

const getArquivoById = async (id: number): Promise<Arquivo | undefined> => {
  const result = await pool.query('SELECT * FROM arquivos WHERE id = $1', [id]);
  return result.rows[0];
};

const deleteArquivo = async (id: number, clientCpf: string): Promise<Arquivo> => {
  const arquivoResult = await pool.query('SELECT * FROM arquivos WHERE id = $1', [id]);
  if (!arquivoResult.rows[0]) {
    throw new AppError('Arquivo não encontrado', 404);
  }
  if (arquivoResult.rows[0].cliente_cpf !== clientCpf) {
    throw new AppError('Arquivo não pertence ao cliente especificado', 403);
  }
  const filePath = path.join(__dirname, '../../../../uploads', arquivoResult.rows[0].filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  const result = await pool.query('DELETE FROM arquivos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export { uploadArquivo, getArquivosByCpf, getLatestArquivoByCpf, getArquivoById, deleteArquivo };
