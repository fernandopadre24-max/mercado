import React from 'react';
import { ICONS } from '../constants';
import { Product } from '../types';

interface ProductsProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onAddProduct: () => void;
  onDeleteProduct: (productId: string) => void;
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

const Products: React.FC<ProductsProps> = ({ products, onEditProduct, onAddProduct, onDeleteProduct }) => {
  const totalCostValue = products.reduce((sum, product) => sum + (product.costPrice * product.stock), 0);
  const totalSaleValue = products.reduce((sum, product) => sum + (product.salePrice * product.stock), 0);
  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;


  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <div className="p-8 bg-light-bg dark:bg-dark-bg h-full flex flex-col gap-6">
      <div className="flex justify-between items-center flex-shrink-0">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Gerenciamento de Produtos</h1>
        <button 
          className="bg-primary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md"
          onClick={onAddProduct}
        >
          <span className="w-5 h-5">{ICONS.plus}</span>
          <span className="ml-2">Adicionar Novo Produto</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
        <StatCard 
            title="Custo Total do Inventário" 
            value={formatCurrency(totalCostValue)}
            subtitle="Custo de todos os itens em estoque"
            icon={ICONS.dollarSign}
            color="bg-orange-500"
        />
        <StatCard 
            title="Valor de Venda do Inventário" 
            value={formatCurrency(totalSaleValue)}
            subtitle="Receita potencial do estoque"
            icon={ICONS.trendUp}
            color="bg-teal-500"
        />
        <StatCard 
            title="Total de Itens" 
            value={String(totalItems)}
            subtitle="Produtos cadastrados"
            icon={ICONS.package}
            color="bg-indigo-500"
        />
        <StatCard 
            title="Itens com Estoque Baixo" 
            value={String(lowStockCount)}
            subtitle="Abaixo do nível mínimo"
            icon={ICONS.hourglass}
            color="bg-red-500"
        />
      </div>

      <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-y-auto flex-grow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider sticky top-0">
              <th className="px-5 py-3">Código de Barras</th>
              <th className="px-5 py-3">Imagem</th>
              <th className="px-5 py-3">Nome do Produto</th>
              <th className="px-5 py-3 text-right">Preço de Custo</th>
              <th className="px-5 py-3 text-right">Preço de Venda</th>
              <th className="px-5 py-3 text-center">Estoque</th>
              <th className="px-5 py-3 text-center">Promoção</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const isLowStock = product.stock <= product.lowStockThreshold;
              return (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-5 py-4 text-sm">
                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{product.barcode}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded" 
                    />
                  </td>
                  <td className="px-5 py-4 text-sm">
                     <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">{product.name}</p>
                  </td>
                   <td className="px-5 py-4 text-sm text-right">
                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap">
                      {formatCurrency(product.costPrice)}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-right">
                    <p className="text-gray-900 dark:text-gray-300 whitespace-no-wrap font-semibold">
                      {formatCurrency(product.salePrice)}
                    </p>
                  </td>
                  <td className={`px-5 py-4 text-sm text-center ${isLowStock ? 'bg-red-100 dark:bg-red-900/50' : ''}`}>
                    <p className={`whitespace-no-wrap ${isLowStock ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-gray-300'}`}>
                      {product.stock}
                      {isLowStock && <span className="text-xs ml-1">(Baixo)</span>}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-center">
                      {product.promotion ? (
                          <span className="bg-green-200 text-green-800 font-semibold py-1 px-3 rounded-full text-xs">
                              Sim
                          </span>
                      ) : (
                          <span className="text-gray-500 dark:text-gray-400">Não</span>
                      )}
                  </td>
                  <td className="px-5 py-4 text-sm text-right">
                    <div className="flex justify-end items-center space-x-2">
                        <button
                            onClick={() => onEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                            title="Editar Produto"
                        >
                            <span className="w-5 h-5">{ICONS.edit}</span>
                        </button>
                        <button
                            onClick={() => onDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                            title="Excluir Produto"
                        >
                            <span className="w-5 h-5">{ICONS.trash}</span>
                        </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;