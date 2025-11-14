import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';

interface SellInInstallmentsModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (customerName: string, installmentsCount: number, cpf: string, cardNumber: string, bank: string) => void;
}

const SellInInstallmentsModal: React.FC<SellInInstallmentsModalProps> = ({ total, onClose, onConfirm }) => {
  const [customerName, setCustomerName] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState(1);
  const [cpf, setCpf] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [bank, setBank] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Por favor, insira o nome do cliente.');
      return;
    }
    onConfirm(customerName, installmentsCount, cpf, cardNumber, bank);
  };
  
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const installmentValue = useMemo(() => {
    if (total > 0 && installmentsCount > 0) {
        return total / installmentsCount;
    }
    return 0;
  }, [total, installmentsCount]);

  const installmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vender Parcelado</h2>
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
                placeholder="Ex: Maria Souza"
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                CPF do Titular
              </label>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                placeholder="000.000.000-00"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Cartão
                    </label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                        placeholder="**** **** **** 1234"
                    />
                </div>
                <div>
                    <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
                        Banco Emissor
                    </label>
                    <input
                        type="text"
                        id="bank"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                        placeholder="Ex: Banco X"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="installmentsCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Parcelas
                  </label>
                  <select
                    id="installmentsCount"
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  >
                    {installmentOptions.map(option => (
                        <option key={option} value={option}>{option}x</option>
                    ))}
                  </select>
                </div>
                <div className="text-right">
                    <p className="block text-sm font-medium text-gray-700 mb-1">
                        Valor da Parcela
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(installmentValue)}
                    </p>
                </div>
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
              Confirmar Venda Parcelada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellInInstallmentsModal;