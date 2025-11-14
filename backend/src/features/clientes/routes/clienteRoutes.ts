// Nome do arquivo: ./backend/src/features/clientes/routes/clienteRoutes.ts
// Finalidade: Rotas para operações de clientes.
import express from 'express';
import validateCliente from '../../../../middleware/validateCliente';
import { auth, restrictTo } from '../../../../middleware/auth';
import { getAllClientes, getNClientes, getClienteByCpf, createCliente, updateCliente, deleteCliente } from '../controllers/clienteController'; // ← Adicione getNClientes aqui

const router = express.Router();

console.log('Configurando rotas de clientes...');
console.log('Controladores carregados:', { getAllClientes, getNClientes, getClienteByCpf, createCliente, updateCliente, deleteCliente }); // ← Inclua getNClientes no log
console.log('Module paths:', module.paths);
try {
  console.log('Resolved path for validateCliente:', require.resolve('../../../../middleware/validateCliente'));
  console.log('Resolved path for auth:', require.resolve('../../../../middleware/auth'));
} catch (err) {
  console.error('Failed to resolve middleware:', err);
}

// Rota paginada principal (substitui getAllClientes para /clientes)
router.get('/', auth, validateCliente('getAll'), getNClientes); // ← Mude para getNClientes (paginado)

// Opcional: Mantenha getAll para rota separada (todos os clientes)
router.get('/all', auth, validateCliente('getAll'), getAllClientes); // ← Rota extra para todos, se precisar

router.get('/:cpf', auth, validateCliente('getByCpf'), getClienteByCpf);
router.post('/', auth, restrictTo('admin'), validateCliente('create'), createCliente);
router.put('/:cpf', auth, restrictTo('admin'), validateCliente('update'), updateCliente);
router.delete('/:cpf', auth, restrictTo('admin'), validateCliente('delete'), deleteCliente);

export default router;
