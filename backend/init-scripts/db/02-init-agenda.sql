-- Nome do arquivo: ./backend/init-scripts/db/02-init-agenda.sql
-- Finalidade: Script SQL para criar tabelas no banco 'agenda'.
-- Conecta ao banco 'agenda' (o entrypoint do PostgreSQL usa o banco inicial)
\c agenda

-- Criação de tabelas no banco 'agenda'

CREATE TABLE IF NOT EXISTS clientes (
    cpf VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS procedimentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tempo_estimado INTEGER NOT NULL,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_cpf VARCHAR(11) REFERENCES clientes(cpf),
    procedimento_id INTEGER REFERENCES procedimentos(id),
    data_hora TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arquivos (
    id SERIAL PRIMARY KEY,
    cliente_cpf VARCHAR(11) REFERENCES clientes(cpf),
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100) NOT NULL,
    tamanho INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
