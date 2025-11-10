import { Contact, Message, ToggleAgentResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Busca todos os contatos
  async getContacts(): Promise<Contact[]> {
    const response = await fetch(`${API_URL}/contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return response.json();
  },

  // Busca conversas de um contato específico
  async getConversation(phone: string): Promise<Message[]> {
    const response = await fetch(`${API_URL}/conversations/${encodeURIComponent(phone)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }
    return response.json();
  },

  // Alterna status do agente (pausar/ativar)
  async toggleAgent(phone: string, active: boolean): Promise<ToggleAgentResponse> {
    const response = await fetch(`${API_URL}/agent/toggle/${encodeURIComponent(phone)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) {
      throw new Error('Failed to toggle agent status');
    }
    return response.json();
  },
};
