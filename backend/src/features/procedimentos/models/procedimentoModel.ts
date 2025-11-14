// Nome do arquivo: ./backend/src/features/procedimentos/models/procedimentoModel.ts
// Finalidade: Modelo de dados para procedimentos.
import pool from '../../../config/database';

interface Procedimento {
  id: number;
  nome: string;
  tempo_estimado: number;
  descricao?: string;
}

class ProcedimentoModel {
  static async getAll(): Promise<Procedimento[]> {
    const result = await pool.query('SELECT * FROM procedimentos');
    return result.rows;
  }

  static async getById(id: number): Promise<Procedimento | undefined> {
    const result = await pool.query('SELECT * FROM procedimentos WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(nome: string, tempoEstimado: number): Promise<Procedimento> {
    const result = await pool.query(
      'INSERT INTO procedimentos (nome, tempo_estimado) VALUES ($1, $2) RETURNING *',
      [nome, tempoEstimado]
    );
    return result.rows[0];
  }

  static async update(id: number, nome: string, tempoEstimado: number, descricao: string | undefined): Promise<Procedimento | undefined> {
    const result = await pool.query(
      'UPDATE procedimentos SET nome = $1, tempo_estimado = $2, descricao = $3 WHERE id = $4 RETURNING *',
      [nome, tempoEstimado, descricao, id]
    );
    return result.rows[0];
  }
}

export default ProcedimentoModel;
