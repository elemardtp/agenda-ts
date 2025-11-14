-- Nome do arquivo: ./backend/init-scripts/db/01-create-db.sql
-- Finalidade: Script SQL para criar o banco de dados e usuário inicial.
-- Cria o banco 'agenda' se ainda não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'agenda'
  ) THEN
    CREATE DATABASE agenda;
  END IF;
END
$$;

-- Cria o usuário 'agendador' com senha 'abobora99' se ainda não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'agendador'
  ) THEN
    CREATE ROLE agendador WITH LOGIN PASSWORD 'abobora99' CREATEDB;
  END IF;
END
$$;

-- Garante que o usuário 'agendador' tenha acesso ao banco 'agenda'
GRANT ALL PRIVILEGES ON DATABASE agenda TO agendador;
