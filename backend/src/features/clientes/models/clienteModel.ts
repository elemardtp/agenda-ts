// Nome do arquivo: ./backend/src/features/clientes/models/clienteModel.ts
// Finalidade: Modelo de dados para clientes.
import pool from '../../../config/database';

interface Cliente {
  cpf: string;
  nome: string;
  email: string;
  created_at: Date;
}

class ClienteModel {
  static async getAll(): Promise<Cliente[]> {
    try {
      const result = await pool.query('SELECT * FROM clientes');
      console.log('Modelo: Resultado de getAll:', result ? result.rows : 'Nenhum resultado');
      return result ? result.rows : [];
    } catch (err) {
      console.error('Erro no modelo ao obter todos os clientes:', (err as Error).message, (err as Error).stack);
      throw err;
    }
  }

  static async getByCpf(cpf: string): Promise<Cliente | undefined> {
    try {
      const result = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);
      console.log('Modelo: Resultado de getByCpf:', result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.error('Erro no modelo ao obter cliente por CPF:', (err as Error).message, (err as Error).stack);
      throw err;
    }
  }

  static async create(cpf: string, nome: string, email: string): Promise<Cliente> {
    try {
      const result = await pool.query(
        'INSERT INTO clientes (cpf, nome, email) VALUES ($1, $2, $3) RETURNING *',
        [cpf, nome, email]
      );
      console.log('Modelo: Cliente criado:', result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.error('Erro no modelo ao criar cliente:', (err as Error).message, (err as Error).stack);
      throw err;
    }
  }

  static async update(cpf: string, nome: string, email: string): Promise<Cliente | undefined> {
    try {
      const result = await pool.query(
        'UPDATE clientes SET nome = $1, email = $2 WHERE cpf = $3 RETURNING *',
        [nome, email, cpf]
      );
      console.log('Modelo: Cliente atualizado:', result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.error('Erro no modelo ao atualizar cliente:', (err as Error).message, (err as Error).stack);
      throw err;
    }
  }

  static async delete(cpf: string): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM clientes WHERE cpf = $1 RETURNING *', [cpf]);
      console.log('Modelo: Cliente deletado:', result.rowCount > 0);
      return result.rowCount > 0;
    } catch (err) {
      console.error('Erro no modelo ao deletar cliente:', (err as Error).message, (err as Error).stack);
      throw err;
    }
  }
}

export default ClienteModel;
