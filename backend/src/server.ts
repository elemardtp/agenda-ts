// Nome do arquivo: ./backend/src/server.ts
// Finalidade: Servidor principal do backend.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import waitOn from 'wait-on';
import path from 'path';
import { errorHandler } from './utils/errorHandler';
import clienteRoutes from './features/clientes/routes/clienteRoutes';
import procedimentoRoutes from './features/procedimentos/routes/procedimentoRoutes';
import agendamentoRoutes from './features/agendamentos/routes/agendamentoRoutes';
import arquivoRoutes from './features/arquivos/routes/arquivoRoutes';
import funcionarioRoutes from './features/funcionarios/routes/funcionarioRoutes';
import pool from './config/database';
import multer from 'multer';

const app = express();
const port = process.env.NODE_PORT || 3000;

// Debug .env
console.log('Env debug: JWT_SECRET loaded?', process.env.JWT_SECRET ? 'Yes (length: ' + process.env.JWT_SECRET.length + ')' : 'No');

// Log global requests
app.use((req, res, next) => {
  console.log(`Request debug: ${req.method} ${req.url} from ${req.get('Origin') || 'unknown'}`);
  next();
});

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/agendamento/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.pdf', '.mp4', '.mov'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens JPG, JPEG, PNG, PDFs ou vídeos MP4, MOV são permitidos'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'], // Fix: Permite Authorization
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Fix: Métodos explícitos
  exposedHeaders: ['Content-Length', 'Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Servidor está saudável' });
});

app.get('/test-db', async (req, res, next) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'success', message: 'Conexão com o PostgreSQL bem-sucedida!', data: result.rows });
  } catch (error) {
    next(error);
  }
});

console.log('Registrando rotas...');
app.use('/api/clientes', clienteRoutes);
console.log('Rotas de clientes registradas.');
app.use('/api/procedimentos', procedimentoRoutes);
console.log('Rotas de procedimentos registradas.');
app.use('/api/agendamentos', agendamentoRoutes);
console.log('Rotas de agendamentos registradas.');
app.use('/api', upload.single('file'), arquivoRoutes);
console.log('Rotas de arquivos registradas.');
app.use('/api/funcionarios', funcionarioRoutes);
console.log('Rotas de funcionários registradas.');

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Servidor funcionando!' });
});

app.use(errorHandler);

async function startApp() {
  try {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Aguardando DB...');
      await waitOn({
        resources: ['tcp:agendamento-pg:5432'],
        timeout: 60000,
        tcpTimeout: 1000,
        interval: 1000,
        simultaneous: 1
      });
      console.log('DB pronto!');
    }
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM. Encerrando graciosamente...');
  pool.end(() => {
    console.log('Conexão com DB fechada.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT. Encerrando graciosamente...');
  pool.end(() => {
    console.log('Conexão com DB fechada.');
    process.exit(0);
  });
});

if (process.env.NODE_ENV !== 'test') {
  startApp();
}

export default app;
