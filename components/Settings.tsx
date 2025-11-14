import React, { useState, useEffect } from 'react';
import { StoreInfo } from '../types';

interface SettingsProps {
  onResetData: () => void;
  storeInfo: StoreInfo;
  onStoreInfoChange: (info: StoreInfo) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onResetData, storeInfo, onStoreInfoChange, theme, onThemeChange }) => {
  const [localStoreInfo, setLocalStoreInfo] = useState(storeInfo);
  
  useEffect(() => {
    setLocalStoreInfo(storeInfo);
  }, [storeInfo]);
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalStoreInfo(prev => ({...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalStoreInfo(prev => ({ ...prev, logoUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStoreInfoChange(localStoreInfo);
    alert('Informações da loja salvas com sucesso!');
  };


  return (
    <div className="p-8 bg-light-bg dark:bg-dark-bg h-full overflow-y-auto text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Configurações</h1>

      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Aparência</h2>
        <div className="flex items-center space-x-4">
          <label className="font-medium">Tema:</label>
          <div className="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => onThemeChange('light')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                theme === 'light'
                  ? 'bg-primary-blue text-white shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Claro
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-primary-blue text-white shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Escuro
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Informações da Loja</h2>
        <form onSubmit={handleInfoSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Loja</label>
                    <input type="text" id="name" name="name" value={localStoreInfo.name} onChange={handleInfoChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço</label>
                    <input type="text" id="address" name="address" value={localStoreInfo.address} onChange={handleInfoChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ</label>
                    <input type="text" id="cnpj" name="cnpj" value={localStoreInfo.cnpj} onChange={handleInfoChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo da Loja</label>
                    <div className="mt-1 flex items-center space-x-4">
                        {localStoreInfo.logoUrl ? (
                            <img src={localStoreInfo.logoUrl} alt="Logo da Loja" className="h-16 w-16 rounded-md object-contain bg-gray-100" />
                        ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        )}
                        <input
                            type="file"
                            id="logo"
                            name="logo"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleLogoChange}
                            className="block w-full text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-full file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-50 file:text-primary-blue
                                       hover:file:bg-blue-100"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-6">
                 <button
                    type="submit"
                    className="bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Salvar Informações
                </button>
            </div>
        </form>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Gerenciamento de Dados</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Restaure os dados do aplicativo para o estado inicial. Isso removerá todos os produtos, funcionários e transações adicionados.
        </p>
        <button
          onClick={onResetData}
          className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          Restaurar Dados Padrão
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Sobre</h2>
        <p>
          <strong>POS Pro</strong> - Versão 1.2.0
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Sistema de Ponto de Venda moderno e completo.
        </p>
      </div>
    </div>
  );
};

export default Settings;