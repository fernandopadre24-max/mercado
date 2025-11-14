import React from 'react';
// FIX: Import Product type for the onEditProduct prop.
import { CartItem as CartItemType, Product, Employee, StoreInfo } from '../types';
import CartItem from './CartItem';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  // FIX: Add onEditProduct prop to allow editing a product from the cart.
  onEditProduct: (product: Product) => void;
  activeOperator: Employee;
  storeInfo: StoreInfo;
  subtotal: number;
  tax: number;
  total: number;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onEditProduct, activeOperator, storeInfo, subtotal, tax, total }) => {
  return (
    <div className="bg-receipt-bg h-full flex flex-col font-mono text-black shadow-lg">
      <div className="p-4 border-b border-dashed border-gray-400 text-center">
        {storeInfo.logoUrl && (
          <img src={storeInfo.logoUrl} alt={`${storeInfo.name} Logo`} className="mx-auto h-16 w-auto object-contain mb-2" />
        )}
        <h2 className="font-bold text-lg">{storeInfo.name}</h2>
        <p className="text-xs">{storeInfo.address}</p>
        <p className="text-xs">CNPJ: {storeInfo.cnpj}</p>
        <p className="text-xs">{new Date().toLocaleString()}</p>
        <p className="text-sm font-semibold my-2">---- CUPOM NÃO FISCAL ----</p>
      </div>
      
      <div className="px-4 py-2 border-b border-dashed border-gray-400">
        <div className="grid grid-cols-12 text-xs font-bold">
            <div className="col-span-1">ITEM</div>
            <div className="col-span-2">CÓDIGO</div>
            <div className="col-span-4">DESCRIÇÃO</div>
            <div className="col-span-3 text-center">QTD</div>
            <div className="col-span-2 text-right">VL ITEM</div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 font-sans">
            Aguardando itens...
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <CartItem 
                key={item.product.id} 
                item={item} 
                index={index + 1} 
                onUpdateQuantity={onUpdateQuantity}
                // FIX: Pass the onEditProduct prop down to the CartItem component.
                onEditProduct={onEditProduct}
              />
            ))}
          </ul>
        )}
      </div>
       <div className="p-4 border-t border-dashed border-gray-400">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>IMPOSTOS (5%)</span>
                <span>R$ {tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-400 my-2"></div>
          <div className="flex justify-between font-bold text-xl">
            <span>TOTAL</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed border-gray-400 my-2"></div>
          <div className="text-xs">
            Operador: {activeOperator.name}. Caixa livre.
          </div>
      </div>
    </div>
  );
};

export default Cart;