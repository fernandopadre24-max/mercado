import React, { useState } from 'react';
import { Product, ShoppingListItem } from '../types';
import { ICONS } from '../constants';

interface ShoppingListProps {
  products: Product[];
  lowStockProducts: Product[];
  shoppingList: ShoppingListItem[];
  onAddItem: (product: Product) => void;
  onUpdateItem: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearList: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  products,
  lowStockProducts,
  shoppingList,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onClearList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery))
    : [];

  const handlePrint = () => {
    window.print();
  };
  
  const shoppingListProductIds = new Set(shoppingList.map(item => item.productId));
  const suggestedProducts = lowStockProducts.filter(p => !shoppingListProductIds.has(p.id));

  return (
    <div className="p-8 bg-light-bg dark:bg-dark-bg h-full flex flex-col gap-6 print:p-4 print:bg-white">
      <div className="flex justify-between items-center flex-shrink-0 print:hidden">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Lista de Compras para Reposição</h1>
      </div>
      
      <div className="hidden print:block text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Lista de Compras</h1>
          <p className="text-sm text-gray-600">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow min-h-0 print:grid-cols-1">
        {/* Suggestions Column */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card shadow-md rounded-lg flex flex-col print:hidden">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 p-4 border-b dark:border-gray-700">Sugestões (Estoque Baixo)</h2>
            <div className="overflow-y-auto p-4 space-y-3">
                {suggestedProducts.length > 0 ? (
                    suggestedProducts.map(product => (
                        <div key={product.id} className="bg-light-bg dark:bg-dark-bg p-3 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{product.name}</p>
                                <p className="text-sm text-red-500">Estoque: {product.stock}</p>
                            </div>
                            <button
                                onClick={() => onAddItem(product)}
                                className="bg-primary-blue text-white rounded-md p-2 hover:bg-blue-700 transition"
                                aria-label={`Adicionar ${product.name} à lista`}
                            >
                                {ICONS.plus}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum item com estoque baixo para sugerir.</p>
                )}
            </div>
        </div>

        {/* Shopping List Column */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card shadow-md rounded-lg flex flex-col print:shadow-none print:border print:border-gray-300">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 p-4 border-b dark:border-gray-700 print:hidden">Sua Lista de Compras ({shoppingList.length})</h2>
            <div className="p-4 relative print:hidden">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produto para adicionar..."
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                />
                {searchQuery && (
                    <ul className="absolute z-10 w-full bg-white dark:bg-dark-card border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                        {filteredProducts.map(p => (
                            <li
                                key={p.id}
                                onClick={() => { onAddItem(p); setSearchQuery(''); }}
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                {p.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex-grow overflow-y-auto px-4 print:p-0">
                <table className="min-w-full leading-normal">
                    <thead className="print:bg-gray-200">
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider print:text-black">
                            <th className="px-5 py-3">Produto</th>
                            <th className="px-5 py-3">Cód. Barras</th>
                            <th className="px-5 py-3 text-center">Quantidade a Comprar</th>
                            <th className="px-5 py-3 text-right print:hidden">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shoppingList.length > 0 ? (
                            shoppingList.map(item => (
                                <tr key={item.productId} className="border-b dark:border-gray-700">
                                    <td className="px-5 py-3 text-sm">{item.productName}</td>
                                    <td className="px-5 py-3 text-sm">{item.productBarcode}</td>
                                    <td className="px-5 py-3 text-sm">
                                        <input
                                            type="number"
                                            value={item.quantityToOrder}
                                            onChange={(e) => onUpdateItem(item.productId, parseInt(e.target.value, 10) || 1)}
                                            min="1"
                                            className="w-24 text-center p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </td>
                                    <td className="px-5 py-3 text-right print:hidden">
                                        <button
                                            onClick={() => onRemoveItem(item.productId)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label={`Remover ${item.productName}`}
                                        >
                                            {ICONS.trash}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 py-10">
                                    Sua lista de compras está vazia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-4 print:hidden">
                <button
                    onClick={onClearList}
                    disabled={shoppingList.length === 0}
                    className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition disabled:bg-gray-400"
                >
                    Limpar Lista
                </button>
                <button
                    onClick={handlePrint}
                    disabled={shoppingList.length === 0}
                    className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition flex items-center disabled:bg-gray-400"
                >
                    <span className="mr-2">{ICONS.barcode}</span>
                    Imprimir
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
