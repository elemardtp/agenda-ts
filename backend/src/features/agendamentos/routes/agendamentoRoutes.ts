// Nome do arquivo: ./backend/src/features/agendamentos/routes/agendamentoRoutes.ts
// Finalidade: Rotas para operações de agendamentos.
import express from 'express';
import * as agendamentoController from '../controllers/agendamentoController';
import { auth, restrictTo } from '../../../../middleware/auth';

const router = express.Router();

console.log('Configurando rotas de agendamentos...');
try {
  console.log('Resolved path for auth:', require.resolve('../../../../middleware/auth'));
} catch (err) {
  console.error('Failed to resolve auth:', err);
}

router.get('/', auth, restrictTo('admin'), agendamentoController.getAll);
router.post('/time-windows', auth, agendamentoController.getTimeWindows);
router.post('/', auth, agendamentoController.create);
router.delete('/:id', auth, restrictTo('admin'), agendamentoController.deleteAgendamento);

export default router;
