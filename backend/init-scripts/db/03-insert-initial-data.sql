-- Nome do arquivo: ./backend/init-scripts/db/03-insert-initial-data.sql
-- Finalidade: Script SQL para inserir dados iniciais no banco.
-- Conecta ao banco 'agenda' como usuário 'agendador'
\c agenda agendador

-- Inserção do usuário admin
INSERT INTO funcionarios (username, password, role, nome, email) VALUES (
  'admin',
  '$2b$10$lUaJe.qFrv79LlLj6J6WYu61xoiaYYlq5YnQ/e625gdGv50sWAeb6',  -- Hash bcrypt para 'cabelo'
  'admin',
  'Admin User',
  'admin@example.com'
)
ON CONFLICT (username) DO NOTHING;

-- Dados iniciais de procedimentos
INSERT INTO procedimentos (nome, tempo_estimado, descricao) VALUES
    ('Consulta', 30, 'Consulta médica geral'),
    ('Exame de Sangue', 15, 'Coleta de sangue para análise'),
    ('Consulta de Retorno', 20, 'Acompanhamento pós-consulta')
ON CONFLICT DO NOTHING;
