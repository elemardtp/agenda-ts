// Nome do arquivo: ./backend/src/features/procedimentos/routes/procedimentoRoutes.ts
// Finalidade: Rotas para operações de procedimentos.
import express from 'express';
import validateProcedimento from '../../../../middleware/validateProcedimento';
import { auth, restrictTo } from '../../../../middleware/auth';
import { getAllProcedimentos, getProcedimentoById, createProcedimento, updateProcedimento } from '../controllers/procedimentoController';

const router = express.Router();

console.log('Configurando rotas de procedimentos...');
console.log('Controladores carregados:', { getAllProcedimentos, getProcedimentoById, createProcedimento, updateProcedimento });
try {
  console.log('Resolved path for validateProcedimento:', require.resolve('../../../../middleware/validateProcedimento'));
  console.log('Resolved path for auth:', require.resolve('../../../../middleware/auth'));
} catch (err) {
  console.error('Failed to resolve middleware:', err);
}

router.get('/', auth, validateProcedimento('getAll'), getAllProcedimentos);
router.get('/:id', auth, validateProcedimento('getById'), getProcedimentoById);
router.post('/', auth, restrictTo('admin'), validateProcedimento('create'), createProcedimento);
router.put('/:id', auth, restrictTo('admin'), validateProcedimento('create'), updateProcedimento);

export default router;
