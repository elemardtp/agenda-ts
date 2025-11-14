// Nome do arquivo: ./backend/src/features/arquivos/models/arquivoModel.ts
// Finalidade: Modelo de dados para arquivos.
import pool from '../../../config/database';

interface Arquivo {
  id: number;
  cliente_cpf: string;
  nome_arquivo: string;
  caminho_arquivo: string;
  tipo_arquivo: string;
  tamanho: number;
  created_at: Date;
}

class ArquivoModel {
  static async getByCpf(clienteCpf: string): Promise<Arquivo[]> {
    const result = await pool.query('SELECT * FROM arquivos WHERE cliente_cpf = $1', [clienteCpf]);
    return result.rows;
  }

  static async create(clienteCpf: string, nomeArquivo: string, caminhoArquivo: string, tipoArquivo: string, tamanho: number): Promise<Arquivo> {
    const result = await pool.query(
      'INSERT INTO arquivos (cliente_cpf, nome_arquivo, caminho_arquivo, tipo_arquivo, tamanho) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [clienteCpf, nomeArquivo, caminhoArquivo, tipoArquivo, tamanho]
    );
    return result.rows[0];
  }

  static async getLatestByCpf(cpf: string): Promise<Arquivo | undefined> {
    const result = await pool.query(
      'SELECT * FROM arquivos WHERE cliente_cpf = $1 ORDER BY created_at DESC LIMIT 1',
      [cpf]
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM arquivos WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

export default ArquivoModel;
