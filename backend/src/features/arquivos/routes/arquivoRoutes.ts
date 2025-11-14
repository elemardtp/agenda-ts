// Nome do arquivo: ./backend/src/features/arquivos/routes/arquivoRoutes.ts
// Finalidade: Rotas para operações de arquivos.
import express from 'express';
import * as ArquivoService from '../services/arquivoService';
import { AppError } from '../../../utils/errorHandler';
import { auth } from '../../../../middleware/auth';

const router = express.Router();

console.log('Configurando rotas de arquivos...');
try {
  console.log('Resolved path for auth:', require.resolve('../../../../middleware/auth'));
} catch (err) {
  console.error('Failed to resolve auth:', err);
}

router.post('/clientes/:cpf/arquivos', auth, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const { originalname, size, filename, mimetype } = req.file as Express.Multer.File;
    const arquivo = await ArquivoService.uploadArquivo(cpf, originalname, size, filename, mimetype);
    res.status(201).json({
      status: 'success',
      message: 'Arquivo uploaded com sucesso!',
      data: arquivo
    });
  } catch (err) {
    next(err);
  }
});

router.get('/clientes/:cpf/arquivos', auth, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const arquivos = await ArquivoService.getArquivosByCpf(cpf);
    res.status(200).json({
      status: 'success',
      data: arquivos
    });
  } catch (err) {
    next(err);
  }
});

router.get('/clientes/:cpf/arquivos/latest', auth, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const arquivo = await ArquivoService.getLatestArquivoByCpf(cpf);
    res.status(200).json({
      status: 'success',
      data: arquivo
    });
  } catch (err) {
    next(err);
  }
});

router.get('/arquivos/:id/download', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const arquivo = await ArquivoService.getArquivoById(parseInt(id));
    if (!arquivo) {
      throw new AppError('Arquivo não encontrado', 404);
    }
    res.download(arquivo.path, arquivo.originalname);
  } catch (err) {
    next(err);
  }
});

router.delete('/arquivos/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cpf } = req.body;
    const arquivo = await ArquivoService.deleteArquivo(parseInt(id), cpf);
    res.status(200).json({
      status: 'success',
      message: 'Arquivo deletado com sucesso!',
      data: arquivo
    });
  } catch (err) {
    next(err);
  }
});

export default router;
