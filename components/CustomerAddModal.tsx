import React, { useState } from 'react';
import { ICONS } from '../constants';

interface CustomerAddModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

const CustomerAddModal: React.FC<CustomerAddModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    } else {
      alert("O nome do cliente não pode estar em branco.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cadastrar Novo Cliente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {ICONS.x}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500">
              O ID do cliente e o código de cliente serão gerados automaticamente.
            </p>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 transition"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddModal;