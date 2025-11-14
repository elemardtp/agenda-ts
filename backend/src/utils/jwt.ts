// Nome do arquivo: ./backend/src/utils/jwt.ts
// Finalidade: Utilitário para gerar tokens JWT.
import jwt from 'jsonwebtoken';

interface Payload {
  [key: string]: any;
}

const generateToken = (payload: Payload): string => {
  console.log('jwt.ts: Generating token with expiresIn: 1d');
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret-key', { expiresIn: '1d' });
};

export { generateToken };
