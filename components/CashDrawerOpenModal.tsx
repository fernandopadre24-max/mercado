import React, { useState } from 'react';
import { ICONS } from '../constants';

interface CashDrawerOpenModalProps {
  operatorName: string;
  onConfirm: (amount: number, reason: string) => void;
  onCancel: () => void;
}

const CashDrawerOpenModal: React.FC<CashDrawerOpenModalProps> = ({ operatorName, onConfirm, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('Fundo de troco inicial');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      alert('Por favor, insira um valor válido para o fundo de caixa.');
      return;
    }
    onConfirm(numericAmount, reason);
  };

  return (
    <div className="fixed inset-0 bg-light-bg dark:bg-dark-bg flex items-center justify-center z-40">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Abertura de Caixa</h2>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-6">
            Operador: <span className="font-semibold">{operatorName}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Por favor, informe o valor inicial no caixa para começar a operar.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor Inicial (R$)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-lg dark:bg-gray-700 dark:text-white"
                required
                autoFocus
                step="0.01"
                min="0"
                placeholder="0,00"
              />
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observação
              </label>
              <input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Fundo de troco"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar e Sair
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 transition"
            >
              Confirmar Abertura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashDrawerOpenModal;