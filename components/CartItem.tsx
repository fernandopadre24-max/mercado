import React from 'react';
// FIX: Import Product type for the onEditProduct prop.
import { CartItem as CartItemType, Product } from '../types';
import { ICONS } from '../constants';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  // FIX: Add onEditProduct prop to allow editing the product.
  onEditProduct: (product: Product) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, index, onUpdateQuantity, onEditProduct }) => {
  const { product, quantity } = item;
  const effectivePrice = product.promotion?.discountedPrice ?? product.salePrice;

  const handleRemoveItem = () => {
    if (window.confirm(`Tem certeza que deseja remover "${product.name}" do carrinho?`)) {
      onUpdateQuantity(product.id, 0);
    }
  };

  return (
    <li className="grid grid-cols-12 text-xs items-center py-1 border-b border-dashed border-gray-200 last:border-none">
      <div className="col-span-1">{index.toString().padStart(3, '0')}</div>
      <div className="col-span-2">{product.barcode}</div>
      <div className="col-span-4 truncate flex items-center">
        {/* FIX: Made the product name clickable to trigger the edit modal. */}
        <span
          className="cursor-pointer hover:underline"
          onClick={() => onEditProduct(product)}
        >
          {product.name}
        </span>
        {product.promotion && (
            <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                PROMO
            </span>
        )}
      </div>
      <div className="col-span-3 flex items-center justify-center space-x-2">
        <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="p-1 rounded-full text-gray-600 hover:bg-gray-200 transition">
            {ICONS.minus}
        </button>
        <span className="font-bold w-6 text-center">{quantity}</span>
        <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="p-1 rounded-full text-gray-600 hover:bg-gray-200 transition">
            {ICONS.plus}
        </button>
        <button onClick={handleRemoveItem} className="text-red-500 hover:text-red-700 transition ml-2">
            {ICONS.trash}
        </button>
    </div>
      <div className="col-span-2 text-right font-semibold">
        {product.promotion ? (
            <div className="flex flex-col items-end">
                <span className="text-red-600">{(product.promotion.discountedPrice * quantity).toFixed(2)}</span>
                <span className="line-through text-gray-500 text-[10px]">
                    {(product.salePrice * quantity).toFixed(2)}
                </span>
            </div>
        ) : (
            <span>{(effectivePrice * quantity).toFixed(2)}</span>
        )}
      </div>
    </li>
  );
};

export default CartItem;