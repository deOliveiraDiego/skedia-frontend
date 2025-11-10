import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routes/contacts';
import conversationsRouter from './routes/conversations';
import agentRouter from './routes/agent';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware (apenas para rotas da API, não assets)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
  }
  next();
});

// Routes
app.use('/api/contacts', contactsRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/agent', agentRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET  /api/contacts`);
  console.log(`   GET  /api/conversations/:phone`);
  console.log(`   PATCH /api/agent/toggle/:phone\n`);
});
