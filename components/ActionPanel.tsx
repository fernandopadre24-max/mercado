import React from 'react';
import { Product, CartItem, Transaction, Employee } from '../types';

interface ActionPanelProps {
    lastScannedItem: Product | null;
    cartItems: CartItem[];
    onClearCart: () => void;
    onCheckout: (method: Transaction['paymentMethod']) => void;
    onFetchSuggestions: () => void;
    onSellOnCredit: () => void;
    onSellInInstallments: () => void;
    onSangria: () => void;
    onSuprimento: () => void;
    onSaveDraft: () => void;
    total: number;
    currentTime: Date;
    searchQuery: string;
    searchResults: Product[];
    onSearchChange: (query: string) => void;
    onSelectProduct: (product: Product) => void;
    onSearchSubmit: (query: string) => void;
    activeOperator: Employee;
    onLogout: () => void;
}

const InfoBox = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-white text-black p-3 rounded-md border border-gray-300 shadow-sm">
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

const ActionPanel: React.FC<ActionPanelProps> = ({ 
    lastScannedItem, cartItems, onClearCart, onCheckout, onFetchSuggestions, onSellOnCredit, onSellInInstallments, onSangria, onSuprimento, onSaveDraft, total, currentTime,
    searchQuery, searchResults, onSearchChange, onSelectProduct, onSearchSubmit,
    activeOperator, onLogout
}) => {

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  const lastCartItem = lastScannedItem ? cartItems.find(item => item.product.id === lastScannedItem.id) : null;
  
  const lastItemPrice = lastCartItem?.product.promotion?.discountedPrice ?? lastCartItem?.product.salePrice;
  const lastItemSubtotal = lastCartItem ? (lastItemPrice * lastCartItem.quantity) : 0;
  
  const lastScannedItemPrice = lastScannedItem?.promotion?.discountedPrice ?? lastScannedItem?.salePrice;


  const formattedDate = currentTime.toLocaleDateString('pt-BR');
  const formattedTime = currentTime.toLocaleTimeString('pt-BR');

  return (
    <div className="bg-primary-blue h-full text-white flex flex-col p-4">
        <div className="relative mb-4">
            <form onSubmit={handleScan} className="flex items-center gap-2">
                <div className="bg-blue-800 p-2 rounded-l-md font-bold">F6</div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Digite para buscar uma peça..."
                    className="w-full p-2 text-black rounded-r-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    autoComplete="off"
                />
            </form>
            {searchResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white text-black rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                    {searchResults.map(product => (
                        <li 
                            key={product.id} 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => onSelectProduct(product)}
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoBox label="Valor Unitário" value={`R$ ${lastScannedItemPrice?.toFixed(2) || '0,00'}`} />
            <InfoBox label="Quantidade" value={`${lastCartItem?.quantity || 0} UN`} />
            <InfoBox label="Subtotal" value={`R$ ${lastItemSubtotal.toFixed(2)}`} />
             <InfoBox label="Código de Barras" value={lastScannedItem?.barcode || 'N/A'} />
        </div>

        <div className="flex-grow space-y-3">
             <button 
                onClick={() => onCheckout('Dinheiro')}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded text-left">
                PAGAR COM DINHEIRO - <span className="font-mono">F1</span>
            </button>
             <button 
                onClick={onClearCart}
                disabled={cartItems.length === 0}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 border-b-4 border-amber-700 hover:border-amber-600 rounded text-left disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed">
                CANCELAR VENDA - <span className="font-mono">F2</span>
            </button>
             <button 
                onClick={() => onCheckout('PIX')}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded text-left">
                PAGAR COM PIX - <span className="font-mono">F3</span>
            </button>
            <button
                onClick={onSellOnCredit}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded text-left">
                VENDER A PRAZO - <span className="font-mono">F4</span>
            </button>
            <button
                onClick={onSellInInstallments}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded text-left">
                VENDER PARCELADO - <span className="font-mono">F5</span>
            </button>
            <button
                onClick={onSangria}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 border-b-4 border-orange-700 hover:border-orange-600 rounded text-left">
                SANGRIA / RETIRADA - <span className="font-mono">F8</span>
            </button>
            <button
                onClick={onSuprimento}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 border-b-4 border-teal-700 hover:border-teal-600 rounded text-left">
                SUPRIMENTO / REFORÇO - <span className="font-mono">F9</span>
            </button>
            <button
                onClick={onSaveDraft}
                disabled={cartItems.length === 0}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 border-b-4 border-indigo-700 hover:border-indigo-600 rounded text-left disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed">
                SALVAR RASCUNHO - <span className="font-mono">F10</span>
            </button>
            <button
                onClick={onFetchSuggestions}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 border-b-4 border-green-700 hover:border-green-600 rounded text-left">
                SUGESTÕES IA - <span className="font-mono">F7</span>
            </button>
             <button
                onClick={onLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 border-b-4 border-red-700 hover:border-red-600 rounded text-left"
             >
                SAIR DO P.D.V - <span className="font-mono">ESC</span>
            </button>
        </div>
        
        <div className="space-y-4 mt-4">
            <div className="bg-primary-dark p-4 rounded-md text-center">
                <p className="text-sm text-gray-300 uppercase">Valor Total da Venda</p>
                <p className="text-5xl font-bold">R$ {total.toFixed(2)}</p>
            </div>
            
             <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-white text-black p-2 rounded">
                    <p className="text-xs uppercase">OPERADOR</p>
                    <p className="font-bold">{activeOperator.name.toUpperCase()}</p>
                </div>
                 <div className="bg-white text-black p-2 rounded">
                    <p className="text-xs uppercase">DATA DA VENDA</p>
                    <p className="font-bold">{formattedDate}</p>
                </div>
                 <div className="bg-white text-black p-2 rounded">
                    <p className="text-xs uppercase">HORA ATUAL</p>
                    <p className="font-bold">{formattedTime}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ActionPanel;