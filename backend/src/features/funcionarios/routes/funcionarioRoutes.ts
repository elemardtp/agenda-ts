// Nome do arquivo: ./backend/src/features/funcionarios/routes/funcionarioRoutes.ts
// Finalidade: Rotas para operações de funcionários, incluindo login.
import express from 'express';
import bcrypt from 'bcrypt';
import * as jwt from '../../../utils/jwt';
import pool from '../../../config/database';

const router = express.Router();

// Rota de login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body as { username: string; password: string };
    console.log(`Tentativa de login para usuário: ${username}`); // Log para depurar tentativa

    // Busca funcionário no banco
    const result = await pool.query(
      'SELECT * FROM funcionarios WHERE username = $1',
      [username]
    );
    const user = result.rows[0] as Funcionario;

    if (!user) {
      console.log(`Login falhou: Usuário ${username} não encontrado`); // Log específico
      return res.status(401).json({ status: 'error', message: 'Usuário não encontrado' });
    }

    // Verifica senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login falhou: Senha incorreta para ${username}`); // Log específico
      return res.status(401).json({ status: 'error', message: 'Senha incorreta' });
    }

    // Gera token JWT
    const token = jwt.generateToken({ id: user.id, username: user.username, role: user.role });
    console.log(`Login bem-sucedido para ${username}, role: ${user.role}`); // Log de sucesso
    res.status(200).json({ status: 'success', token, role: user.role });
  } catch (err) {
    console.error(`Erro no login: ${(err as Error).message}`); // Log de erro geral
    next(err);
  }
});

export default router;
