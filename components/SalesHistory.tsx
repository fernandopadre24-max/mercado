import React, { useState, useMemo } from 'react';
import { Transaction, Employee } from '../types';
import { ICONS } from '../constants';

interface SalesHistoryProps {
  transactions: Transaction[];
  employees: Employee[];
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalSalesCount: number;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => (
  <div className={`${color} text-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-40 relative`}>
    <div>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
    <p className="text-xs opacity-80">{subtitle}</p>
    <div className="absolute top-4 right-4 opacity-70">
      {icon}
    </div>
  </div>
);


const SalesHistory: React.FC<SalesHistoryProps> = ({ transactions, employees, totalRevenue, paidRevenue, pendingRevenue, totalSalesCount }) => {
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);

  const { groupedSales } = useMemo(() => {
    const groups: { [key: string]: { employee: Employee; transactions: Transaction[]; groupTotal: number } } = {};

    transactions.forEach(tx => {
      const employee = employees.find(e => e.id === tx.employeeId);
      if (!employee) return;

      if (!groups[employee.id]) {
        groups[employee.id] = {
          employee: employee,
          transactions: [],
          groupTotal: 0,
        };
      }
      groups[employee.id].transactions.push(tx);
      groups[employee.id].groupTotal += tx.total;
    });

    const sortedGroups = Object.values(groups).sort((a, b) => a.employee.name.localeCompare(b.employee.name));
    
    return { groupedSales: sortedGroups };
  }, [transactions, employees]);

  const handleToggle = (employeeId: string) => {
    setExpandedEmployeeId(prevId => (prevId === employeeId ? null : employeeId));
  };
  
  const paymentMethodPill = (method: Transaction['paymentMethod']) => {
    switch (method) {
      case 'Dinheiro':
        return <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E3F2FD] text-[#1E88E5]">Dinheiro</span>;
      case 'PIX':
        return <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8EAF6] text-[#3949AB]">PIX</span>;
      case 'Cartão':
        return <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800">Cartão</span>;
      case 'Boleto':
        return <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-800">Boleto</span>;
      default:
        return <span>{method}</span>;
    }
  };

  const statusPill = (status: Transaction['status']) => {
    return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status === 'Pago' ? 'bg-[#E0F2F1] text-[#00897B]' : 'bg-yellow-100 text-yellow-800'}`}>{status}</span>;
  };

  return (
    <div className="p-8 bg-light-bg dark:bg-dark-bg h-full overflow-y-auto font-sans">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Visão Geral de Vendas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Receita Total" 
          value={formatCurrency(totalRevenue)} 
          subtitle="Soma de todas as vendas"
          icon={ICONS.trendUp}
          color="bg-blue-500"
        />
        <StatCard 
          title="Receita Paga" 
          value={formatCurrency(paidRevenue)} 
          subtitle="Total já recebido"
          icon={ICONS.dollarSign}
          color="bg-teal-500"
        />
        <StatCard 
          title="Receita Pendente" 
          value={formatCurrency(pendingRevenue)} 
          subtitle="Valores a receber"
          icon={ICONS.hourglass}
          color="bg-amber-500"
        />
        <StatCard 
          title="Total de Vendas" 
          value={String(totalSalesCount)}
          subtitle="Número de transações"
          icon={ICONS.cart}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          <span className="col-span-4 pl-10">Itens</span>
          <span className="col-span-2">Data</span>
          <span className="col-span-2 text-center">Pagamento</span>
          <span className="col-span-2 text-center">Status</span>
          <span className="col-span-2 text-right">Total</span>
        </div>

        {/* Sales Groups */}
        <div className="bg-white dark:bg-dark-card">
          {groupedSales.map(group => {
            const isExpanded = expandedEmployeeId === group.employee.id;
            return (
              <div key={group.employee.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                {/* Collapsed Row */}
                <div 
                  className="grid grid-cols-12 px-4 py-3 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleToggle(group.employee.id)}
                  aria-expanded={isExpanded}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggle(group.employee.id)}
                >
                  <div className="col-span-10 flex items-center">
                    <button aria-label={isExpanded ? 'Recolher' : 'Expandir'} className={`flex items-center justify-center w-6 h-6 rounded text-gray-600 dark:text-gray-300`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
                    </button>
                    <span className="font-bold text-gray-800 dark:text-gray-200 ml-4">({group.employee.employeeId}) {group.employee.name}</span>
                  </div>
                  <div className="col-span-2 text-right font-bold text-blue-800 dark:text-blue-400 text-lg">{formatCurrency(group.groupTotal)}</div>
                </div>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pb-2 bg-gray-50 dark:bg-gray-800/50">
                    {group.transactions.map((tx) => (
                      <div key={tx.id} className="grid grid-cols-12 pl-14 pr-4 py-4 items-start border-t border-gray-200 dark:border-gray-700">
                        {/* Itens */}
                        <div className="col-span-4 text-sm text-gray-700 dark:text-gray-300">
                            <ul className="list-disc pl-5 space-y-1">
                              {tx.items.map(item => (
                                <li key={item.productId}>{item.quantity}x {item.productName} ({formatCurrency(item.price)})</li>
                              ))}
                            </ul>
                            <div className="pl-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <p><span className="font-semibold">Cliente:</span> {tx.customerName}</p>
                                {tx.cpf && (
                                    <p><span className="font-semibold">CPF:</span> {tx.cpf}</p>
                                )}
                                {tx.boletoDueDate && (
                                    <p><span className="font-semibold">Vencimento:</span> {new Date(tx.boletoDueDate).toLocaleDateString('pt-BR')}</p>
                                )}
                                {tx.installments && (
                                    <p><span className="font-semibold">Parcelado:</span> {tx.installments.count}x de {formatCurrency(tx.installments.value)}</p>
                                )}
                                {tx.cardNumber && (
                                    <p><span className="font-semibold">Cartão:</span> {tx.cardNumber}</p>
                                )}
                                {tx.bank && (
                                    <p><span className="font-semibold">Banco:</span> {tx.bank}</p>
                                )}
                            </div>
                        </div>
                        {/* Data */}
                        <span className="col-span-2 text-sm">{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                        {/* Pagamento */}
                        <div className="col-span-2 text-center">{paymentMethodPill(tx.paymentMethod)}</div>
                        {/* Status */}
                        <div className="col-span-2 text-center">{statusPill(tx.status)}</div>
                        {/* Total */}
                        <span className="col-span-2 text-right font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(tx.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;