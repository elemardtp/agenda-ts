// Nome do arquivo: ./backend/src/features/agendamentos/models/agendamentoModel.ts
// Finalidade: Modelo de dados para agendamentos.
import pool from '../../../config/database';

interface Agendamento {
  id: number;
  cliente_cpf: string;
  procedimento_id: number;
  data_hora: Date;
  created_at: Date;
}

class AgendamentoModel {
  static async getAll(): Promise<Agendamento[]> {
    const result = await pool.query('SELECT * FROM agendamentos');
    return result.rows;
  }

  static async create(clienteCpf: string, procedimentoId: number, dataHora: Date): Promise<Agendamento> {
    const result = await pool.query(
      'INSERT INTO agendamentos (cliente_cpf, procedimento_id, data_hora) VALUES ($1, $2, $3) RETURNING *',
      [clienteCpf, procedimentoId, dataHora]
    );
    return result.rows[0];
  }

  static async getTimeWindows(data: Date, procedimentoIds: number[]): Promise<Agendamento[]> {
    const result = await pool.query(
      'SELECT * FROM agendamentos WHERE data_hora::date = $1',
      [data]
    );
    return result.rows;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM agendamentos WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

export default AgendamentoModel;
