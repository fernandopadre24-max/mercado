import React from 'react';
import { ICONS } from '../constants';

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[];
  isLoading: boolean;
}

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({ isOpen, onClose, suggestions, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            {ICONS.lightbulb} <span className="ml-2">Sugestões da IA</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {ICONS.x}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="ml-4 text-gray-600">Gerando sugestões...</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
              <li key={index} className="bg-light-bg p-4 rounded-lg flex items-center">
                <span className="text-primary-blue">{ICONS.sparkle}</span>
                <span className="ml-3 text-gray-700 font-medium">{suggestion}</span>
              </li>
            )) : (
                <p className="text-center text-gray-500 h-32 flex items-center justify-center">Nenhuma sugestão encontrada.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsModal;
