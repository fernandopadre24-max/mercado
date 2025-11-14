import React, { useState, useMemo } from 'react';
import { Transaction, Employee, CashDrawerOperation } from '../types';
import { ICONS } from '../constants';

interface ReportsProps {
  allTransactions: Transaction[];
  employees: Employee[];
  cashDrawerOperations: CashDrawerOperation[];
}

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

const Reports: React.FC<ReportsProps> = ({ allTransactions, employees, cashDrawerOperations }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [reportData, setReportData] = useState<Transaction[]>([]);
  const [reportDrawerOps, setReportDrawerOps] = useState<CashDrawerOperation[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleEmployeeSelectionChange = (employeeId: string) => {
    setSelectedEmployeeIds(prev =>
        prev.includes(employeeId)
            ? prev.filter(id => id !== employeeId)
            : [...prev, employeeId]
    );
  };
  
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const handleGenerateReport = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const filteredTransactions = allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      const dateMatch = (!start || txDate >= start) && (!end || txDate <= end);
      const employeeMatch = selectedEmployeeIds.length === 0 || (tx.employeeId && selectedEmployeeIds.includes(tx.employeeId));
      return dateMatch && employeeMatch;
    });
    setReportData(filteredTransactions);

    const filteredOps = cashDrawerOperations.filter(op => {
        const opDate = new Date(op.date);
        const dateMatch = (!start || opDate >= start) && (!end || opDate <= end);
        const employeeMatch = selectedEmployeeIds.length === 0 || selectedEmployeeIds.includes(op.employeeId);
        return dateMatch && employeeMatch;
    });
    setReportDrawerOps(filteredOps);

    setReportGenerated(true);
  };

  const reportSummary = useMemo(() => {
    const totalRevenue = reportData.reduce((sum, tx) => sum + tx.total, 0);
    const paidRevenue = reportData.filter(tx => tx.status === 'Pago').reduce((sum, tx) => sum + tx.total, 0);
    const pendingRevenue = reportData.filter(tx => tx.status === 'Pendente').reduce((sum, tx) => sum + tx.total, 0);
    const numberOfTransactions = reportData.length;
    return { totalRevenue, paidRevenue, pendingRevenue, numberOfTransactions };
  }, [reportData]);
  
  const getEmployeeName = (employeeId: string) => {
    return employees.find(e => e.id === employeeId)?.name || 'Desconhecido';
  };

  const employeeSalesSummary = useMemo(() => {
    if (reportData.length === 0) return [];
    
    const summary: { [key: string]: { totalSales: number; transactionCount: number } } = {};

    reportData.forEach(tx => {
        if (tx.employeeId) {
            if (!summary[tx.employeeId]) {
                summary[tx.employeeId] = { totalSales: 0, transactionCount: 0 };
            }
            summary[tx.employeeId].totalSales += tx.total;
            summary[tx.employeeId].transactionCount++;
        }
    });

    return Object.entries(summary).map(([employeeId, data]) => ({
        employeeId: employeeId,
        employeeName: getEmployeeName(employeeId),
        ...data,
    })).sort((a, b) => b.totalSales - a.totalSales);
  }, [reportData, employees]);


  return (
    <div className="p-8 bg-light-bg dark:bg-dark-bg h-full overflow-y-auto">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Relatório de Vendas</h1>

      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            <div className="md:col-span-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2" />
            </div>
            <div className="md:col-span-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Fim</label>
                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funcionários</label>
                 <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2 border rounded-md p-2 max-h-28 overflow-y-auto border-gray-300 dark:border-gray-600">
                    {employees.map(employee => (
                    <div key={employee.id} className="flex items-center">
                        <input
                        id={`employee-${employee.id}`}
                        type="checkbox"
                        checked={selectedEmployeeIds.includes(employee.id)}
                        onChange={() => handleEmployeeSelectionChange(employee.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-primary-blue focus:ring-primary-blue"
                        />
                        <label htmlFor={`employee-${employee.id}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        {employee.name}
                        </label>
                    </div>
                    ))}
                </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Deixe em branco para selecionar todos.</p>
            </div>
            <div className="md:col-span-1 flex items-end h-full">
                <button
                    onClick={handleGenerateReport}
                    className="bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md w-full h-10"
                >
                    Gerar Relatório
                </button>
            </div>
         </div>
      </div>
      
      {reportGenerated && (
        <>
          {reportData.length > 0 || reportDrawerOps.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard 
                    title="Receita Total" 
                    value={formatCurrency(reportSummary.totalRevenue)} 
                    subtitle="Soma das vendas no período"
                    icon={ICONS.trendUp}
                    color="bg-blue-500"
                  />
                  <StatCard 
                    title="Receita Paga" 
                    value={formatCurrency(reportSummary.paidRevenue)}
                    subtitle="Total recebido no período"
                    icon={ICONS.dollarSign}
                    color="bg-teal-500"
                  />
                  <StatCard 
                    title="Receita Pendente" 
                    value={formatCurrency(reportSummary.pendingRevenue)}
                    subtitle="A receber no período"
                    icon={ICONS.hourglass}
                    color="bg-amber-500"
                  />
                  <StatCard 
                    title="Número de Transações" 
                    value={String(reportSummary.numberOfTransactions)} 
                    subtitle="Total de vendas no período"
                    icon={ICONS.cart}
                    color="bg-purple-500"
                  />
              </div>
              
              {employeeSalesSummary.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Vendas por Funcionário</h2>
                    <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    <th className="px-5 py-3">Funcionário</th>
                                    <th className="px-5 py-3 text-right">Transações</th>
                                    <th className="px-5 py-3 text-right">Vendas Totais</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {employeeSalesSummary.map(summary => (
                                    <tr key={summary.employeeId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-5 py-4 text-sm font-medium">{summary.employeeName}</td>
                                        <td className="px-5 py-4 text-sm text-right">{summary.transactionCount}</td>
                                        <td className="px-5 py-4 text-sm text-right font-semibold">{formatCurrency(summary.totalSales)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              )}

              {reportData.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Todas as Transações</h2>
                    <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            <th className="px-5 py-3">ID da Transação</th>
                            <th className="px-5 py-3">Data</th>
                            <th className="px-5 py-3">Funcionário</th>
                            <th className="px-5 py-3 text-right">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-5 py-4 text-sm">
                                <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{tx.id}</p>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{new Date(tx.date).toLocaleString('pt-BR')}</p>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{getEmployeeName(tx.employeeId!)}</p>
                                </td>
                                <td className="px-5 py-4 text-sm text-right">
                                <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap font-semibold">{formatCurrency(tx.total)}</p>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
              )}

              {reportDrawerOps.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Operações de Caixa</h2>
                    <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            <th className="px-5 py-3">Data</th>
                            <th className="px-5 py-3">Tipo</th>
                            <th className="px-5 py-3">Funcionário</th>
                            <th className="px-5 py-3">Motivo</th>
                            <th className="px-5 py-3 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportDrawerOps.map((op) => (
                            <tr key={op.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-5 py-4 text-sm">
                                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{new Date(op.date).toLocaleString('pt-BR')}</p>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    <p className={`whitespace-no-wrap font-semibold ${op.type === 'Sangria' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{op.type}</p>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{op.employeeName}</p>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{op.reason || '-'}</p>
                                </td>
                                <td className="px-5 py-4 text-sm text-right">
                                    <p className={`whitespace-no-wrap font-semibold ${op.type === 'Sangria' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {formatCurrency(op.amount)}
                                    </p>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-dark-card rounded-lg shadow-md">
                <p className="text-gray-500 dark:text-gray-400">Nenhum dado para o período e filtro selecionados. Por favor, ajuste os filtros e gere um novo relatório.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;