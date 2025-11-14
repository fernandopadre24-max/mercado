import React from 'react';
import { Employee } from '../types';
import { ICONS } from '../constants';

interface EmployeesProps {
  employees: Employee[];
  onAddEmployee: () => void;
}

const Employees: React.FC<EmployeesProps> = ({ employees, onAddEmployee }) => {
  return (
    <div className="p-8 bg-light-bg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Gerenciamento de Funcionários</h1>
        <button 
          className="bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md"
          onClick={onAddEmployee}
        >
          <span className="w-5 h-5">{ICONS.plus}</span>
          <span className="ml-2">Cadastrar Novo Funcionário</span>
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-5 py-3">ID do Funcionário</th>
              <th className="px-5 py-3">Nome</th>
              <th className="px-5 py-3">Cargo</th>
              <th className="px-5 py-3">Contato</th>
              <th className="px-5 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr 
                key={employee.id} 
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-5 py-4 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{employee.employeeId}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{employee.name}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                   <p className="text-gray-900 whitespace-no-wrap">{employee.role}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                   <p className="text-gray-900 whitespace-no-wrap">{employee.contact}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                   <p className="text-gray-900 whitespace-no-wrap">{employee.email}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;