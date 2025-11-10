import React, { useEffect, useRef, useState } from 'react';
import { Contact, Message as MessageType } from '../types';
import { api } from '../services/api';
import Message from './Message';

interface ChatWindowProps {
  contact: Contact | null;
  onAgentToggle: (phone: string, active: boolean) => Promise<void>;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, onAgentToggle, onClose }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contact) {
      loadMessages(contact.phone);
    }
  }, [contact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (phone: string) => {
    setLoading(true);
    try {
      const data = await api.getConversation(phone);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!contact) return;

    setToggling(true);
    try {
      await onAgentToggle(contact.phone, !contact.agent_active);
    } catch (error) {
      console.error('Error toggling agent:', error);
      alert('Erro ao alterar status do agente');
    } finally {
      setToggling(false);
    }
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Selecione um contato para ver a conversa</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header da conversa */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Fechar conversa"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{contact.name || 'Sem nome'}</h2>
            <p className="text-sm text-gray-500">{contact.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${contact.agent_active ? 'text-emerald-600' : 'text-red-500'}`}>
            {contact.agent_active ? '🟢 Agente Ativo' : '🔴 Agente Pausado'}
          </span>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              contact.agent_active
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {toggling ? 'Alterando...' : contact.agent_active ? 'Pausar Agente' : 'Ativar Agente'}
          </button>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Carregando mensagens...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Nenhuma mensagem encontrada</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
