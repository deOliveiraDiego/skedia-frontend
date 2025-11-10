import React from 'react';
import { Contact } from '../types';
import ContactItem from './ContactItem';

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  loading: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedContact,
  onSelectContact,
  loading,
}) => {
  if (loading) {
    return (
      <div className="w-80 border-r border-gray-200 bg-white flex items-center justify-center">
        <p className="text-gray-500">Carregando contatos...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="w-80 border-r border-gray-200 bg-white flex items-center justify-center p-4">
        <p className="text-gray-500 text-center">Nenhum contato encontrado</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col overflow-hidden bg-white">
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Contatos ({contacts.length})</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isSelected={selectedContact?.id === contact.id}
            onClick={() => onSelectContact(contact)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactList;
