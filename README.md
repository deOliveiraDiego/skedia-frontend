# Skedia Frontend - Chat Agent

Interface web para visualizar e gerenciar conversas do agente Skedia.

## 📋 Características

- ✅ Interface estilo WhatsApp Web
- ✅ Lista de contatos com busca e filtro
- ✅ Visualização completa do histórico de conversas
- ✅ Pausar/Ativar agente por contato
- ✅ Indicadores visuais de status do agente
- ✅ Refresh manual das informações

## 🏗️ Estrutura do Projeto

```
skedia-frontend/
├── frontend/          # Aplicação React + TypeScript + Tailwind
├── backend/           # API Node.js + Express + PostgreSQL
└── README.md
```

## 🚀 Instalação e Configuração

### 1️⃣ Configurar Banco de Dados

Primeiro, adicione a coluna `agent_active` na tabela `leads`:

```sql
ALTER TABLE leads
ADD COLUMN agent_active BOOLEAN DEFAULT true;
```

### 2️⃣ Configurar Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seu_banco_de_dados
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3001
```

### 3️⃣ Configurar Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` (opcional, o padrão já aponta para `http://localhost:3001/api`):

```env
VITE_API_URL=http://localhost:3001/api
```

## ▶️ Executar o Projeto

### Iniciar o Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Iniciar o Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📡 API Endpoints

### Backend

- **GET** `/api/contacts` - Lista todos os contatos com conversas
- **GET** `/api/conversations/:phone` - Histórico de mensagens de um contato
- **PATCH** `/api/agent/toggle/:phone` - Alterna status do agente
  ```json
  Body: { "active": true | false }
  ```

## 🎨 Interface

### Tela Principal

- **Sidebar Esquerda:** Lista de contatos
  - Nome e telefone
  - Última mensagem
  - Badge de status do agente (🟢 Ativo / 🔴 Pausado)
  - Campo de busca
  - Botão de atualizar

- **Área Principal:** Conversa selecionada
  - Mensagens do agente (à esquerda, fundo cinza)
  - Mensagens do usuário (à direita, fundo azul)
  - Botão para pausar/ativar agente no header

## 🗄️ Estrutura do Banco de Dados

### Tabelas Utilizadas

- **`leads`**: Informações dos contatos
  - `phone` (usado como chave para relacionar)
  - `name`
  - `agent_active` (nova coluna)

- **`n8n_chat_histories`**: Histórico de mensagens
  - `session_id` (relaciona com `leads.phone`)
  - `message` (JSONB com type: 'ai' | 'human' e content)
  - `created_at`

## 🔧 Tecnologias

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL (via `pg`)

## 🔄 Integração com n8n

O n8n deve implementar a lógica para verificar o campo `agent_active` antes de enviar mensagens:

```typescript
// Exemplo de query no n8n
SELECT agent_active FROM leads WHERE phone = $1
```

Se `agent_active = false`, o agente não deve processar/responder mensagens daquele contato.

## 📝 Build para Produção

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

Os arquivos de build estarão na pasta `frontend/dist/`.

## 🤝 Contribuindo

Este é um projeto interno. Para dúvidas ou sugestões, entre em contato com o time de desenvolvimento.

## 📄 Licença

Propriedade de Skedia.
