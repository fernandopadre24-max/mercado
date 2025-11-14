import React, { useState } from 'react';

interface FirebaseSetupProps {
  onSave: (config: object) => void;
  initialError?: string | null;
}

const FirebaseSetup: React.FC<FirebaseSetupProps> = ({ onSave, initialError }) => {
  const [config, setConfig] = useState('');
  const [error, setError] = useState<string | null>(initialError || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!config.trim()) {
      setError('Firebase config object is required.');
      return;
    }
    try {
        const parsedConfig = JSON.parse(config);
        if (typeof parsedConfig !== 'object' || !parsedConfig.apiKey) {
            throw new Error('Invalid config object. Make sure it includes an apiKey.');
        }
        onSave(parsedConfig);
    } catch(err: any) {
        setError(`Invalid JSON or config object: ${err.message}`);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-light-bg p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Conectar ao Firebase</h1>
          <p className="mt-2 text-gray-600">
            Para usar o aplicativo com seus próprios dados, cole o objeto de configuração do seu projeto Firebase.
          </p>
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <strong>Erro:</strong> {error}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg border bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-700">Onde encontrar a configuração?</h2>
            <ol className="mt-4 list-inside list-decimal space-y-3 text-sm text-gray-600">
              <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-blue font-medium underline">Console do Firebase</a>.</li>
              <li>Selecione seu projeto.</li>
              <li>Vá para as <strong>Configurações do Projeto</strong> (ícone de engrenagem).</li>
              <li>Na aba 'Geral', role para baixo até 'Seus apps'.</li>
              <li>Selecione seu app da Web ou crie um novo.</li>
              <li>Em 'Configuração do SDK', escolha 'Config' e copie todo o objeto `firebaseConfig`.</li>
            </ol>
             <p className="mt-4 text-xs text-gray-500">
              Certifique-se de que seu banco de dados Firestore está criado e as regras de segurança permitem leitura e escrita.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-6">
            <div>
              <label htmlFor="firebaseConfig" className="block text-sm font-medium text-gray-700">
                Objeto de Configuração do Firebase
              </label>
              <textarea
                id="firebaseConfig"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                rows={10}
                placeholder={`{\n  apiKey: "AIza...",\n  authDomain: "...",\n  ... \n}`}
                className="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-primary-blue focus:ring-primary-blue"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary-blue px-4 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Conectar e Salvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
