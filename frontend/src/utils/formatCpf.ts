// Nome do arquivo: ./frontend/src/utils/formatCpf.ts
// Finalidade: Funções para formatar e validar CPF.
import { cpf } from 'cpf-cnpj-validator';

// Format a CPF string (e.g., "12345678901" -> "123.456.789-01")
export const formatCpf = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return cpf;
};

// Clean a CPF string (e.g., "123.456.789-01" -> "12345678901")
export const cleanCpf = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

// Validate CPF
export const isValidCpf = (value: string): boolean => {  // Renamed parameter to 'value' to avoid shadowing the imported 'cpf'
  return cpf.isValid(cleanCpf(value));
};
