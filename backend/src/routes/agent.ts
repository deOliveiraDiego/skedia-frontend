import { Router, Request, Response } from 'express';
import pool from '../db/connection';
import { ToggleAgentRequest, ToggleAgentResponse } from '../types';

const router = Router();

// PATCH /api/agent/toggle/:phone - Alterna status do agente para um contato
router.patch('/toggle/:phone', async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const { active }: ToggleAgentRequest = req.body;

    if (typeof active !== 'boolean') {
      console.log(`⚠️  Valor inválido para active: ${active}`);
      return res.status(400).json({ error: 'Invalid active value. Must be boolean.' });
    }

    console.log(`🔄 Alterando agente de ${phone} para: ${active ? 'ATIVO' : 'PAUSADO'}`);

    const query = `
      UPDATE leads
      SET agent_active = $1, updated_at = NOW()
      WHERE phone = $2
      RETURNING agent_active;
    `;

    const result = await pool.query(query, [active, phone]);

    if (result.rowCount === 0) {
      console.log(`❌ Contato ${phone} não encontrado`);
      return res.status(404).json({ error: 'Contact not found' });
    }

    console.log(`✅ Agente ${active ? 'ativado' : 'pausado'} para ${phone}`);

    const response: ToggleAgentResponse = {
      success: true,
      agent_active: result.rows[0].agent_active,
    };

    res.json(response);
  } catch (error: any) {
    console.error(`❌ ERRO ao alterar status do agente para ${req.params.phone}:`);
    console.error('   Mensagem:', error.message);
    res.status(500).json({
      error: 'Failed to toggle agent status',
      details: error.message
    });
  }
});

export default router;
