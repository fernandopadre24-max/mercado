import React from 'react';
import { ICONS } from '../constants';
import { Supplier } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  onAddSupplier: () => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAddSupplier, onEditSupplier, onDeleteSupplier }) => {
  return (
    <div className="p-8 bg-light-bg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Gerenciamento de Fornecedores</h1>
        <button 
          className="bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md"
          onClick={onAddSupplier}
        >
          <span className="w-5 h-5">{ICONS.plus}</span>
          <span className="ml-2">Cadastrar Novo Fornecedor</span>
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Nome do Fornecedor</th>
              <th className="px-5 py-3">CNPJ</th>
              <th className="px-5 py-3">Pessoa de Contato</th>
              <th className="px-5 py-3">Telefone</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr 
                key={supplier.id} 
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-5 py-4 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{supplier.id}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{supplier.name}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                   <p className="text-gray-900 whitespace-no-wrap">{supplier.cnpj}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                   <p className="text-gray-900 whitespace-no-wrap">{supplier.contactPerson}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                   <p className="text-gray-900 whitespace-no-wrap">{supplier.phone}</p>
                </td>
                <td className="px-5 py-4 text-sm text-right">
                    <div className="flex justify-end items-center space-x-2">
                        <button
                            onClick={() => onEditSupplier(supplier)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Editar Fornecedor"
                        >
                            <span className="w-5 h-5">{ICONS.edit}</span>
                        </button>
                        <button
                            onClick={() => onDeleteSupplier(supplier.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Excluir Fornecedor"
                        >
                            <span className="w-5 h-5">{ICONS.trash}</span>
                        </button>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;