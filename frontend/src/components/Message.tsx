import React from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.message.type === 'ai';
  const formattedTime = new Date(message.created_at).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-xl ${
          isAI
            ? 'bg-emerald-50 text-gray-800 border border-emerald-100'
            : 'bg-emerald-500 text-white'
        }`}
      >
        <div className="text-sm font-semibold mb-1">
          {isAI ? 'Agente' : 'Usuário'}
        </div>
        <div className="whitespace-pre-wrap break-words">
          {message.message.content}
        </div>
        <div className={`text-xs mt-1 ${isAI ? 'text-emerald-600' : 'text-emerald-100'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;
