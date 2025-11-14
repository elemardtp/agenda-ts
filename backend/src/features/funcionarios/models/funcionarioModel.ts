// Nome do arquivo: ./backend/src/features/funcionarios/models/funcionarioModel.ts
// Finalidade: Modelo de dados para funcionários.
import pool from '../../../config/database';

interface Funcionario {
  id: number;
  username: string;
  role: string;
  nome: string;
  email: string;
  password?: string;
}

class FuncionarioModel {
  static async create(username: string, password: string, role: string, nome: string, email: string): Promise<Funcionario> {
    const result = await pool.query(
      'INSERT INTO funcionarios (username, password, role, nome, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, nome, email',
      [username, password, role, nome, email]
    );
    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<Funcionario | undefined> {
    const result = await pool.query('SELECT * FROM funcionarios WHERE username = $1', [username]);
    return result.rows[0];
  }
}

export default FuncionarioModel;
