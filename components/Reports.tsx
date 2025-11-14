import React, { useState, useMemo } from 'react';
import { Transaction, Employee, CashDrawerOperation } from '../types';
import { ICONS } from '../constants';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-xl shadow-lg text-white ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg h-full flex flex-col min-h-[350px]">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex-shrink-0">{title}</h3>
    <div className="flex-grow flex items-center justify-center w-full h-full">
      {children}
    </div>
  </div>
);

const TransactionRow: React.FC<{ tx: Transaction; getEmployeeName: (id: string) => string }> = ({ tx, getEmployeeName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  
  const paymentMethodPill = (method: Transaction['paymentMethod']) => {
    const styles = {
      'Dinheiro': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'PIX': 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
      'Cartão': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
      'Boleto': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    };
    return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[method]}`}>{method}</span>;
  };

  const statusPill = (status: Transaction['status']) => {
    const styles = {
      'Pago': 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
      'Pendente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    };
    return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[status]}`}>{status}</span>;
  };
  
  return (
    <>
      <tr onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <td className="px-5 py-4 text-sm">
          <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{tx.id}</p>
        </td>
        <td className="px-5 py-4 text-sm">
          <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{new Date(tx.date).toLocaleString('pt-BR')}</p>
        </td>
        <td className="px-5 py-4 text-sm">
          <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{getEmployeeName(tx.employeeId)}</p>
        </td>
        <td className="px-5 py-4 text-sm text-center">{paymentMethodPill(tx.paymentMethod)}</td>
        <td className="px-5 py-4 text-sm text-center">{statusPill(tx.status)}</td>
        <td className="px-5 py-4 text-sm text-right">
          <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap font-semibold">{formatCurrency(tx.total)}</p>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50 dark:bg-gray-800/50">
          <td colSpan={6} className="p-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <h4 className="font-bold mb-2">Detalhes da Transação:</h4>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                {tx.items.map(item => (
                  <li key={item.productId}>{item.quantity}x {item.productName} ({formatCurrency(item.price)})</li>
                ))}
              </ul>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p><span className="font-semibold">Cliente:</span> {tx.customerName}</p>
                {tx.cpf && <p><span className="font-semibold">CPF:</span> {tx.cpf}</p>}
                {tx.boletoDueDate && <p><span className="font-semibold">Vencimento:</span> {new Date(tx.boletoDueDate).toLocaleDateString('pt-BR')}</p>}
                {tx.installments && <p><span className="font-semibold">Parcelado:</span> {tx.installments.count}x de {formatCurrency(tx.installments.value)}</p>}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};


interface ReportsProps {
  allTransactions: Transaction[];
  employees: Employee[];
  cashDrawerOperations: CashDrawerOperation[];
}

const Reports: React.FC<ReportsProps> = ({ allTransactions, employees, cashDrawerOperations }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [reportData, setReportData] = useState<Transaction[]>([]);
  const [reportDrawerOps, setReportDrawerOps] = useState<CashDrawerOperation[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const handleGenerateReport = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const filteredTransactions = allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      const dateMatch = (!start || txDate >= start) && (!end || txDate <= end);
      const employeeMatch = selectedEmployeeIds.length === 0 || selectedEmployeeIds.includes(tx.employeeId);
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
  
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedEmployeeIds([]);
    setReportGenerated(false);
    setReportData([]);
    setReportDrawerOps([]);
  };

  const handlePrint = () => window.print();

  const reportSummary = useMemo(() => {
    const totalRevenue = reportData.reduce((sum, tx) => sum + tx.total, 0);
    const paidRevenue = reportData.filter(tx => tx.status === 'Pago').reduce((sum, tx) => sum + tx.total, 0);
    const pendingRevenue = reportData.filter(tx => tx.status === 'Pendente').reduce((sum, tx) => sum + tx.total, 0);
    const sangriaTotal = reportDrawerOps.filter(op => op.type === 'Sangria').reduce((sum, op) => sum + op.amount, 0);
    return { totalRevenue, paidRevenue, pendingRevenue, numberOfTransactions: reportData.length, sangriaTotal };
  }, [reportData, reportDrawerOps]);

  const { dailySales, salesByPaymentMethod } = useMemo(() => {
    const daily: { [date: string]: number } = {};
    const payment: { [method: string]: number } = { 'Dinheiro': 0, 'PIX': 0, 'Cartão': 0, 'Boleto': 0 };

    reportData.forEach(tx => {
      const dateStr = new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      daily[dateStr] = (daily[dateStr] || 0) + tx.total;
      payment[tx.paymentMethod] = (payment[tx.paymentMethod] || 0) + tx.total;
    });

    return {
      dailySales: Object.entries(daily).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date, 'pt-BR')),
      salesByPaymentMethod: Object.entries(payment).map(([name, value]) => ({ name, value })),
    };
  }, [reportData]);

  const getEmployeeName = (employeeId: string) => employees.find(e => e.id === employeeId)?.name || 'Desconhecido';
  
  const paymentColors: { [key: string]: string } = {
    'Dinheiro': 'bg-green-400',
    'PIX': 'bg-sky-400',
    'Cartão': 'bg-indigo-400',
    'Boleto': 'bg-amber-400',
  };

  return (
    <div className="p-8 bg-light-bg dark:bg-dark-bg h-full overflow-y-auto">
      <div className="print:hidden">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Relatórios</h1>
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início</label>
              <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Fim</label>
              <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funcionários</label>
              <select onChange={e => setSelectedEmployeeIds(Array.from(e.target.selectedOptions, option => option.value))} value={selectedEmployeeIds} multiple className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm p-2" size={3}>
                {employees.map(employee => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleGenerateReport} className="flex-1 bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md">Gerar</button>
              <button onClick={handleClearFilters} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Limpar</button>
              <button onClick={handlePrint} className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition" aria-label="Imprimir Relatório">{ICONS.barcode}</button>
            </div>
          </div>
        </div>
      </div>
      
      {reportGenerated && (
        <div id="report-content" className="space-y-8">
          {reportData.length > 0 || reportDrawerOps.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Receita Total" value={formatCurrency(reportSummary.totalRevenue)} icon={ICONS.trendUp} color="bg-blue-500" />
                <StatCard title="Receita Paga" value={formatCurrency(reportSummary.paidRevenue)} icon={ICONS.dollarSign} color="bg-teal-500" />
                <StatCard title="Total Retirado" value={formatCurrency(reportSummary.sangriaTotal)} icon={ICONS.chart} color="bg-orange-500" />
                <StatCard title="Nº de Vendas" value={String(reportSummary.numberOfTransactions)} icon={ICONS.cart} color="bg-purple-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <ChartCard title="Vendas Diárias">
                    {dailySales.length > 0 ? (
                        <div className="flex justify-around items-end h-full w-full pt-4 space-x-2">
                          {dailySales.map(day => (
                            <div key={day.date} className="flex flex-col items-center flex-1 h-full text-center">
                              <div className="h-full w-full flex items-end justify-center">
                                <div className="bg-blue-400 w-4/5 rounded-t-md hover:bg-blue-500 transition-colors" style={{ height: `${(day.total / Math.max(...dailySales.map(d => d.total), 1)) * 100}%` }} title={`${day.date}: ${formatCurrency(day.total)}`}></div>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">{day.date}</span>
                            </div>
                          ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Sem dados de vendas para o gráfico.</p>
                    )}
                  </ChartCard>
                </div>
                <div className="lg:col-span-2">
                  <ChartCard title="Receita por Pagamento">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="space-y-2 w-full max-w-xs">
                        {salesByPaymentMethod.map(method => (
                          <div key={method.name}>
                              <div className="flex justify-between items-center text-sm mb-1">
                                <span className="flex items-center text-gray-600 dark:text-gray-300">
                                  <span className={`w-3 h-3 rounded-full mr-2 ${paymentColors[method.name] || 'bg-gray-400'}`}></span>
                                  {method.name}
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(method.value)}</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                    className={`${paymentColors[method.name] || 'bg-gray-400'} h-2 rounded-full`}
                                    style={{ width: `${(method.value / Math.max(reportSummary.totalRevenue, 1)) * 100}%` }}
                                ></div>
                              </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ChartCard>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Transações Detalhadas</h2>
                <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">Data</th>
                        <th className="px-5 py-3">Funcionário</th>
                        <th className="px-5 py-3 text-center">Pagamento</th>
                        <th className="px-5 py-3 text-center">Status</th>
                        <th className="px-5 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>{reportData.map(tx => <TransactionRow key={tx.id} tx={tx} getEmployeeName={getEmployeeName} />)}</tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-dark-card rounded-lg shadow-md">
              <p className="text-gray-500 dark:text-gray-400">Nenhum dado para o período e filtro selecionados. Ajuste os filtros e gere um novo relatório.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
