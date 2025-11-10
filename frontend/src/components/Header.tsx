import React from 'react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, onRefresh, isRefreshing }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar contato por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
    </div>
  );
};

export default Header;
