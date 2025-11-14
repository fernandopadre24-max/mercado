import React, { useState } from 'react';
import { Customer, Transaction } from '../types';
import { ICONS } from '../constants';

interface CustomersProps {
  customers: Customer[];
  onAddCustomer: () => void;
}

const CustomerDetails = ({ customer }: { customer: Customer }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">{customer.name}</h3>
    <div className="space-y-2">
      <p><strong>ID do Cliente:</strong> {customer.customerId}</p>
      <p><strong>Pontos de Fidelidade:</strong> {customer.points}</p>
    </div>
    <div className="mt-6">
      <h4 className="text-xl font-semibold text-gray-700 mb-3">Histórico de Compras</h4>
      <div className="space-y-3">
        {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
          customer.purchaseHistory.map(transaction => (
            <TransactionDetail key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <p className="text-gray-500">Nenhuma transação encontrada.</p>
        )}
      </div>
    </div>
  </div>
);

// FIX: Changed TransactionDetail component to use React.FC to correctly type it as a React component. This resolves an issue where the 'key' prop was not recognized.
const TransactionDetail: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button 
        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="font-semibold">{transaction.id}</p>
          <p className="text-sm text-gray-600">Data: {new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
          <p className="text-sm text-gray-600">Vendedor: {transaction.employeeName}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-primary-blue">R$ {transaction.total.toFixed(2)}</p>
          <span className="text-xs text-gray-500">{isOpen ? 'Ver menos' : 'Ver detalhes'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <h5 className="font-semibold text-gray-700 mb-2">Itens da Venda:</h5>
          <ul className="space-y-1 text-sm">
            {transaction.items.map(item => (
              <li key={item.productId} className="flex justify-between">
                <span>{item.productName} (x{item.quantity})</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const Customers: React.FC<CustomersProps> = ({ customers, onAddCustomer }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

  // When the list of customers changes (e.g., a new one is added),
  // update the selected customer if it no longer exists or if none is selected.
  React.useEffect(() => {
    if (selectedCustomer && !customers.find(c => c.id === selectedCustomer.id)) {
      setSelectedCustomer(customers[0] || null);
    } else if (!selectedCustomer && customers.length > 0) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  return (
    <div className="p-8 bg-light-bg h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Gerenciamento de Clientes</h1>
        <button 
          className="bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md"
          onClick={onAddCustomer}
        >
          <span className="w-5 h-5">{ICONS.plus}</span>
          <span className="ml-2">Cadastrar Novo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100%-104px)]">
        <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {customers.map(customer => (
              <li key={customer.id}>
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className={`w-full text-left p-4 ${selectedCustomer?.id === customer.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                >
                  <p className={`font-semibold ${selectedCustomer?.id === customer.id ? 'text-primary-blue' : 'text-gray-800'}`}>{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.customerId}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 overflow-y-auto">
          {selectedCustomer ? (
            <CustomerDetails customer={selectedCustomer} />
          ) : (
            <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-md">
              <p className="text-gray-500">Selecione um cliente para ver os detalhes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;