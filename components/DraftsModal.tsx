import React from 'react';
import { Draft } from '../types';
import { ICONS } from '../constants';

interface DraftsModalProps {
  drafts: Draft[];
  onLoad: (draft: Draft) => void;
  onDelete: (draftId: string) => void;
  onClose: () => void;
}

const DraftsModal: React.FC<DraftsModalProps> = ({ drafts, onLoad, onDelete, onClose }) => {
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-2xl p-6 w-full max-w-2xl m-4 transform transition-all flex flex-col h-[70vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <span className="mr-2">{ICONS.hourglass}</span>
            Vendas Salvas como Rascunho
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {ICONS.x}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {drafts.length > 0 ? (
            <ul className="space-y-3">
              {drafts.map(draft => (
                <li key={draft.id} className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Rascunho de <span className="text-primary-blue dark:text-blue-400">{draft.operatorName}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(draft.date).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {draft.items.length} item(s) - Total: <span className="font-bold">{formatCurrency(draft.total)}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => onDelete(draft.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80"
                      aria-label="Excluir rascunho"
                    >
                      {ICONS.trash}
                    </button>
                    <button
                      onClick={() => onLoad(draft)}
                      className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 transition font-semibold"
                    >
                      Carregar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <div className="text-5xl mb-4">{ICONS.package}</div>
              <p className="text-lg font-semibold">Nenhum rascunho encontrado</p>
              <p className="text-sm">Salve uma venda no PDV para retomá-la mais tarde.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftsModal;