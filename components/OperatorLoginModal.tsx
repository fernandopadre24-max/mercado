import React from 'react';
import { Employee } from '../types';
import { ICONS } from '../constants';

interface OperatorLoginModalProps {
  employees: Employee[];
  onLogin: (employee: Employee) => void;
}

const OperatorLoginModal: React.FC<OperatorLoginModalProps> = ({ employees, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-light-bg flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Selecione o Operador</h2>
        <p className="text-gray-500 mb-8">Escolha um operador para iniciar a sessão no Ponto de Venda.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {employees.map(employee => (
            <button
              key={employee.id}
              onClick={() => onLogin(employee)}
              className="group flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-transparent hover:border-primary-blue hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
            >
              <div className="p-4 bg-gray-200 rounded-full mb-3 text-gray-600 group-hover:bg-blue-200 group-hover:text-primary-blue transition">
                {ICONS.user}
              </div>
              <p className="text-lg font-semibold text-gray-900">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.role}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorLoginModal;
