import React, { useState, useEffect } from 'react';
import { Contact } from './types';
import { api } from './services/api';
import AppHeader from './components/AppHeader';
import Header from './components/Header';
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchTerm, contacts]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await api.getContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      alert('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = contacts.filter(
      (contact) =>
        contact.name?.toLowerCase().includes(term) ||
        contact.phone.includes(term)
    );
    setFilteredContacts(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();

    // Atualizar o contato selecionado se houver
    if (selectedContact) {
      const updatedContact = contacts.find(c => c.id === selectedContact.id);
      if (updatedContact) {
        setSelectedContact(updatedContact);
      }
    }

    setRefreshing(false);
  };

  const handleAgentToggle = async (phone: string, active: boolean) => {
    try {
      await api.toggleAgent(phone, active);

      // Atualizar o estado local
      const updatedContacts = contacts.map(contact =>
        contact.phone === phone
          ? { ...contact, agent_active: active }
          : contact
      );
      setContacts(updatedContacts);

      // Atualizar o contato selecionado
      if (selectedContact?.phone === phone) {
        setSelectedContact({ ...selectedContact, agent_active: active });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCloseConversation = () => {
    setSelectedContact(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />
      <div className="flex-1 flex overflow-hidden">
        <ContactList
          contacts={filteredContacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          loading={loading}
        />
        <ChatWindow
          contact={selectedContact}
          onAgentToggle={handleAgentToggle}
          onClose={handleCloseConversation}
        />
      </div>
    </div>
  );
}

export default App;
