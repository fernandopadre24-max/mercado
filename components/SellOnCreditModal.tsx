import React, { useState } from 'react';
import { ICONS } from '../constants';

interface SellOnCreditModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (customerName: string, dueDate: string) => void;
}

const SellOnCreditModal: React.FC<SellOnCreditModalProps> = ({ total, onClose, onConfirm }) => {
  const [customerName, setCustomerName] = useState('');
  
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default to 30 days from now
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  const [dueDate, setDueDate] = useState(getDefaultDueDate());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Por favor, insira o nome do cliente.');
      return;
    }
    onConfirm(customerName, dueDate);
  };
  
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vender a Prazo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {ICONS.x}
          </button>
        </div>
        
        <div className="text-center my-6">
            <p className="text-lg text-gray-500">Total da Venda</p>
            <p className="text-5xl font-extrabold text-primary-blue">{formatCurrency(total)}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Cliente
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                required
                autoFocus
                placeholder="Ex: João da Silva"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                required
              />
            </div>
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
              Confirmar Venda a Prazo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellOnCreditModal;