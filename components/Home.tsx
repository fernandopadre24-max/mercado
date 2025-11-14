import React from 'react';
import { ICONS } from '../constants';
import { DailySale, SalesByPaymentMethod, TopSellingProduct, Product } from '../types';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => (
  <div className={`${color} text-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-40 relative overflow-hidden`}>
    <div>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-4xl font-bold mt-2 truncate" title={value}>{value}</p>
    </div>
    <p className="text-xs opacity-80">{subtitle}</p>
    <div className="absolute top-4 right-4 opacity-20 text-5xl">
      {icon}
    </div>
  </div>
);

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg h-full flex flex-col min-h-[350px]">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex-shrink-0">{title}</h3>
        <div className="flex-grow flex items-center justify-center">
            {children}
        </div>
    </div>
);

interface ListCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const ListCard: React.FC<ListCardProps> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg h-full flex flex-col min-h-[350px]">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <ul className="space-y-3 overflow-y-auto">
            {children}
        </ul>
    </div>
);


interface HomeProps {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalSalesCount: number;
  averageTicket: number;
  dailySales: DailySale[];
  salesByPaymentMethod: SalesByPaymentMethod[];
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: Product[];
}

const Home: React.FC<HomeProps> = ({ 
    totalRevenue, 
    paidRevenue, 
    pendingRevenue, 
    totalSalesCount, 
    averageTicket,
    dailySales,
    salesByPaymentMethod,
    topSellingProducts,
    lowStockProducts
}) => {
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  
  const dailySalesMaxValue = Math.max(...dailySales.map(d => d.total), 1);
  const paymentMethodMaxValue = Math.max(...salesByPaymentMethod.map(d => d.value), 1);
  
  const paymentColors: { [key: string]: string } = {
    'Dinheiro': 'bg-green-400',
    'PIX': 'bg-sky-400',
    'Cartão': 'bg-indigo-400',
    'Boleto': 'bg-amber-400',
  };

  return (
    <div className="p-8 bg-light-bg dark:bg-dark-bg h-full overflow-y-auto">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Painel de Controle</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
        <StatCard 
          title="Ticket Médio" 
          value={formatCurrency(averageTicket)}
          subtitle="Valor médio por venda"
          icon={ICONS.calculator}
          color="bg-pink-500"
        />
      </div>
      
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Vendas nos Últimos 7 Dias">
            <div className="flex justify-around items-end h-full w-full pt-4 space-x-2">
                {dailySales.map(day => (
                    <div key={day.date} className="flex flex-col items-center flex-1 h-full text-center">
                        <div className="h-full w-full flex items-end justify-center">
                            <div 
                                className="bg-blue-400 w-4/5 rounded-t-md hover:bg-blue-500 transition-colors" 
                                style={{ height: `${(day.total / dailySalesMaxValue) * 100}%` }}
                                title={`${day.date}: ${formatCurrency(day.total)}`}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">{day.date}</span>
                    </div>
                ))}
            </div>
        </ChartCard>
        
        <ChartCard title="Receita por Forma de Pagamento">
            <div className="flex justify-around items-end h-full w-full pt-4 space-x-4">
                {salesByPaymentMethod.map(method => (
                    <div key={method.name} className="flex flex-col items-center flex-1 h-full text-center">
                        <div className="h-full w-full flex items-end justify-center">
                            <div 
                                className={`${paymentColors[method.name] || 'bg-gray-400'} w-4/5 rounded-t-md hover:opacity-80 transition-opacity`}
                                style={{ height: `${(method.value / paymentMethodMaxValue) * 100}%` }}
                                title={`${method.name}: ${formatCurrency(method.value)}`}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{method.name}</span>
                    </div>
                ))}
            </div>
        </ChartCard>

        <ListCard title="Top 5 Produtos Mais Vendidos" icon={ICONS.package}>
            {topSellingProducts.length > 0 ? topSellingProducts.map(product => (
                <li key={product.name} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <span className="text-gray-600 dark:text-gray-300 truncate pr-4">{product.name}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 flex-shrink-0">{product.quantity} un.</span>
                </li>
            )) : <p className="text-center text-gray-500 dark:text-gray-400">Não há dados de vendas suficientes.</p>}
        </ListCard>

        <ListCard title="Itens com Estoque Baixo" icon={ICONS.hourglass}>
            {lowStockProducts.length > 0 ? lowStockProducts.map(product => (
                <li key={product.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <span className="text-gray-600 dark:text-gray-300 truncate pr-4">{product.name}</span>
                    <span className="font-bold text-red-500 flex-shrink-0">{product.stock} / {product.lowStockThreshold} un.</span>
                </li>
            )) : <p className="text-center text-gray-500 dark:text-gray-400">Nenhum item com estoque baixo.</p>}
        </ListCard>
      </div>
    </div>
  );
};

export default Home;