-- Script SQL para adicionar coluna agent_active na tabela leads
-- Execute este script no seu banco de dados PostgreSQL

-- Adiciona a coluna agent_active (default: true)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS agent_active BOOLEAN DEFAULT true;

-- Comentário explicativo da coluna
COMMENT ON COLUMN leads.agent_active IS 'Indica se o agente está ativo (true) ou pausado (false) para este contato';

-- Verificar se a coluna foi criada com sucesso
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'leads' AND column_name = 'agent_active';
