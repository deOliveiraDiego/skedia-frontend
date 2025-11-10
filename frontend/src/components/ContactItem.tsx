import React from 'react';
import { Contact } from '../types';

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isSelected, onClick }) => {
  const lastMessageTime = contact.last_message_time
    ? new Date(contact.last_message_time).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-emerald-50 transition-colors ${
        isSelected ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-semibold text-gray-800">
          {contact.name || 'Sem nome'}
        </h3>
        <span className={`text-xs ${contact.agent_active ? 'text-emerald-600' : 'text-red-500'}`}>
          {contact.agent_active ? '🟢' : '🔴'}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">{contact.phone}</p>
      {contact.last_message && (
        <p className="text-sm text-gray-400 truncate mb-1">
          {contact.last_message}
        </p>
      )}
      {lastMessageTime && (
        <p className="text-xs text-gray-400">{lastMessageTime}</p>
      )}
    </div>
  );
};

export default ContactItem;
