import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { Supplier } from '../types';

interface SupplierEditModalProps {
  supplier: Supplier;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
}

const SupplierEditModal: React.FC<SupplierEditModalProps> = ({ supplier, onClose, onSave }) => {
  const [formData, setFormData] = useState<Supplier>(supplier);

  useEffect(() => {
    setFormData(supplier);
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!formData.name || !formData.cnpj) {
        alert("Por favor, preencha o nome e o CNPJ do fornecedor.");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Editar Fornecedor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {ICONS.x}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Fornecedor</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" required />
            </div>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" required />
            </div>
             <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">Pessoa de Contato</label>
              <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 transition">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierEditModal;
