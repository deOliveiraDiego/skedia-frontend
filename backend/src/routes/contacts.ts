import { Router, Request, Response } from 'express';
import pool from '../db/connection';
import { ContactListItem } from '../types';

const router = Router();

// GET /api/contacts - Lista todos os contatos com conversas
router.get('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    console.log('📋 Iniciando busca de contatos...');

    const query = `
      SELECT
        l.id,
        l.name,
        l.phone,
        COALESCE(l.agent_active, true) as agent_active,
        (
          SELECT message->>'content'
          FROM n8n_chat_histories
          WHERE session_id = l.phone
          ORDER BY created_at DESC
          LIMIT 1
        ) as last_message,
        (
          SELECT created_at::text
          FROM n8n_chat_histories
          WHERE session_id = l.phone
          ORDER BY created_at DESC
          LIMIT 1
        ) as last_message_time
      FROM leads l
      WHERE EXISTS (
        SELECT 1 FROM n8n_chat_histories
        WHERE session_id = l.phone
      )
      ORDER BY last_message_time DESC NULLS LAST;
    `;

    console.log('   → Executando query no banco...');
    const result = await pool.query<ContactListItem>(query);
    const duration = Date.now() - startTime;

    console.log(`✅ ${result.rows.length} contatos encontrados em ${duration}ms`);
    res.json(result.rows);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ ERRO ao buscar contatos (após ${duration}ms):`);
    console.error('   Mensagem:', error.message);
    console.error('   Código:', error.code);
    console.error('   Detalhes:', error.detail || 'N/A');
    res.status(500).json({
      error: 'Failed to fetch contacts',
      details: error.message
    });
  }
});

export default router;
