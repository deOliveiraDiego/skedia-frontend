# 🚀 Início Rápido

## Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL
- npm ou yarn

## ⚡ Instalação Rápida

### 1. Instalar dependências

```bash
# Na raiz do projeto
npm run install:all
```

Ou manualmente:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar Banco de Dados

Execute o script SQL:

```bash
psql -U seu_usuario -d seu_banco < database-migration.sql
```

Ou manualmente no seu cliente PostgreSQL:

```sql
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS agent_active BOOLEAN DEFAULT true;
```

### 3. Configurar Variáveis de Ambiente

**Backend** (`backend/.env`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3001
```

**Frontend** (`frontend/.env`) - opcional:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Executar o Projeto

**Terminal 1 - Backend:**

```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**

```bash
npm run dev:frontend
```

## 🌐 Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 🔍 Testando

1. Abra http://localhost:3000
2. Você verá a lista de contatos na esquerda
3. Clique em um contato para ver as mensagens
4. Use o botão no header para pausar/ativar o agente

## ⚠️ Troubleshooting

### Backend não conecta ao banco

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão: `psql -U seu_usuario -d seu_banco`

### Frontend não carrega contatos

- Verifique se o backend está rodando
- Abra o console do navegador (F12)
- Verifique a URL da API no `.env`

### Nenhum contato aparece

- Certifique-se de que existe ao menos um registro na tabela `leads` com correspondência na `n8n_chat_histories`
- O `session_id` deve corresponder ao `phone` do lead

## 📝 Próximos Passos

1. Integrar com n8n para verificar `agent_active`
2. Customizar a interface conforme necessário
3. Adicionar autenticação se necessário
4. Deploy em produção

## 💡 Dicas

- Use `Ctrl+C` para parar os servidores
- Mudanças no código recarregam automaticamente (hot reload)
- Logs do backend aparecem no terminal
- Erros do frontend aparecem no console do navegador
