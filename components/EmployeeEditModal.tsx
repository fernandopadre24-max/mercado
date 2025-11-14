import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { Employee } from '../types';

interface EmployeeEditModalProps {
  employee: Employee;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState<Employee>(employee);

  useEffect(() => {
    setFormData(employee);
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Editar Funcionário</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {ICONS.x}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" required />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" required />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contato (Telefone)</label>
                <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" />
              </div>
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue" />
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

export default EmployeeEditModal;
