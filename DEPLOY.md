# Deploy no EasyPanel

Este guia mostra como fazer deploy do Skedia Chat no EasyPanel.

## Estrutura do Projeto

- **Backend** (Node.js + Express + TypeScript): API REST em `/backend`
- **Frontend** (React + Vite + TypeScript): Interface em `/frontend`

## Pré-requisitos

- Conta no EasyPanel com VPS configurado
- Repositório GitHub com o código
- Banco de dados PostgreSQL (Supabase ou outro)

## Deploy do Backend

1. **Criar novo serviço no EasyPanel**
   - Tipo: `Node.js`
   - Nome: `skedia-backend`
   - Repositório: Seu repositório GitHub
   - Branch: `main`
   - Build Path: `backend`

2. **Configurar Build**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: `3001`

3. **Variáveis de Ambiente**
   Adicione as seguintes variáveis no EasyPanel:
   ```
   DB_HOST=aws-1-sa-east-1.pooler.supabase.com
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres.rwobgpecszfxahwyqpst
   DB_PASSWORD=U4RMwzTlrFdLipCB
   PORT=3001
   NODE_ENV=production
   ```

4. **Após o deploy**
   - Anote a URL pública do backend (ex: `https://skedia-backend.easypanel.host`)

## Deploy do Frontend

1. **Criar arquivo `.env` local**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Configurar URL do Backend**
   Edite o arquivo `.env`:
   ```
   VITE_API_URL=https://skedia-backend.easypanel.host
   ```
   ⚠️ **Importante**: Substitua pela URL real do seu backend no EasyPanel!

3. **Criar novo serviço no EasyPanel**
   - Tipo: `Static Site` ou `Node.js`
   - Nome: `skedia-frontend`
   - Repositório: Seu repositório GitHub
   - Branch: `main`
   - Build Path: `frontend`

4. **Configurar Build**
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Port (se Node.js): `3000`

   **OU**, se usar Static Site:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

5. **Variáveis de Ambiente**
   Adicione no EasyPanel:
   ```
   VITE_API_URL=https://skedia-backend.easypanel.host
   ```
   ⚠️ Substitua pela URL real do backend!

## Ordem de Deploy

1. **Primeiro**: Deploy do Backend
2. **Depois**: Deploy do Frontend (usando a URL do backend)

## Testando

Após o deploy:

1. Acesse a URL do frontend
2. Você deve ver a lista de contatos carregando
3. Clique em um contato para ver as mensagens
4. Teste o botão de pausar/ativar agente

## Troubleshooting

### Backend não conecta ao banco
- Verifique as variáveis de ambiente no EasyPanel
- Confirme que o Supabase permite conexões externas
- Verifique os logs do container

### Frontend não carrega contatos
- Confirme que `VITE_API_URL` está correto
- Verifique se o backend está rodando
- Abra o Console do navegador (F12) para ver erros
- Verifique se há erro de CORS (o backend já tem CORS habilitado)

### Erro de Build
- Backend: Verifique se o TypeScript compila localmente (`npm run build`)
- Frontend: Verifique se o build funciona localmente (`npm run build`)

## Comandos Úteis

```bash
# Testar build do backend localmente
cd backend
npm install
npm run build
npm start

# Testar build do frontend localmente
cd frontend
npm install
npm run build
npm run preview

# Testar aplicação completa localmente
# Terminal 1 (Backend):
cd backend && npm run dev

# Terminal 2 (Frontend):
cd frontend && npm run dev
```

## Banco de Dados

O projeto usa as seguintes tabelas:

- `leads`: Contatos com campos `id`, `name`, `phone`, `agent_active`
- `n8n_chat_histories`: Histórico de mensagens com `session_id` (= phone)

Se a coluna `agent_active` não existir, rode:
```sql
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS agent_active BOOLEAN DEFAULT true;
```

## Arquitetura

```
┌─────────────┐      HTTPS      ┌─────────────┐      PostgreSQL      ┌──────────┐
│   Frontend  │ ───────────────> │   Backend   │ ───────────────────> │ Supabase │
│  (React)    │                  │  (Express)  │                      │   (DB)   │
└─────────────┘                  └─────────────┘                      └──────────┘
```

## Segurança

- ✅ Arquivo `.env` está no `.gitignore`
- ✅ Backend usa SSL para conexão com Supabase
- ✅ CORS configurado no backend
- ⚠️ **Nunca commite arquivos `.env` com credenciais**

## Suporte

Em caso de problemas:
1. Verifique os logs no EasyPanel
2. Teste localmente primeiro
3. Confirme as variáveis de ambiente
