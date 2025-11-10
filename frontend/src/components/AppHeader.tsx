import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">skedia</span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
