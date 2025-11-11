import { Router, Request, Response } from 'express';
import pool from '../db/connection';
import { queryWithRetry } from '../db/retry';
import { ChatMessage } from '../types';

const router = Router();

// GET /api/conversations/:phone - Busca histórico de mensagens por telefone
router.get('/:phone', async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    console.log(`💬 Buscando conversa de ${phone}...`);

    const query = `
      SELECT
        id,
        session_id,
        message,
        created_at::text
      FROM n8n_chat_histories
      WHERE session_id = $1
      ORDER BY created_at ASC;
    `;

    const result = await queryWithRetry<ChatMessage>(pool, query, [phone]);
    console.log(`✅ ${result.rows.length} mensagens encontradas`);
    res.json(result.rows);
  } catch (error: any) {
    console.error(`❌ ERRO ao buscar conversa de ${req.params.phone}:`);
    console.error('   Mensagem:', error.message);
    res.status(500).json({
      error: 'Failed to fetch conversation',
      details: error.message
    });
  }
});

export default router;
