import React, { useState } from 'react';
import { Product } from '../types';
import { ICONS } from '../constants';

interface ProductAddModalProps {
  onClose: () => void;
  onSave: (newProductData: Omit<Product, 'id'>) => void;
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    costPrice: 0,
    salePrice: 0,
    barcode: '',
    imageUrl: '',
    stock: 0,
    lowStockThreshold: 10,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.barcode) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Adicionar Novo Produto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {ICONS.x}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                required
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço de Custo (R$)
                    </label>
                    <input
                        type="number"
                        id="costPrice"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço de Venda (R$)
                    </label>
                    <input
                        type="number"
                        id="salePrice"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                        required
                    />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Estoque Inicial
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                        Nível Mínimo de Estoque
                    </label>
                    <input
                        type="number"
                        id="lowStockThreshold"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                        required
                    />
                </div>
            </div>
            <div>
              <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Barras
              </label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                required
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem do Produto
                </label>
                <div className="mt-1 flex items-center space-x-4">
                    {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="h-16 w-16 rounded-md object-cover bg-gray-100" />
                    ) : (
                        <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    )}
                    <div className="flex-grow space-y-2">
                        <div>
                            <label htmlFor="imageUrlFile" className="text-xs text-gray-600">Fazer upload de arquivo:</label>
                            <input
                                type="file"
                                id="imageUrlFile"
                                name="imageUrlFile"
                                accept="image/png, image/jpeg, image/gif"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-full file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-blue-50 file:text-primary-blue
                                           hover:file:bg-blue-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="text-xs text-gray-600">Ou colar URL da imagem:</label>
                            <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl && formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://exemplo.com/imagem.png"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 transition"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAddModal;