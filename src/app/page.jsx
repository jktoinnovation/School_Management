'use client';

import { useState } from 'react';
import EleveForm from '@/components/EleveForm';
import EleveList from '@/components/EleveList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEleveAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <EleveForm onEleveAdded={handleEleveAdded} />
          </div>
          <div>
            <EleveList key={refreshKey} />
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Instructions
          </h3>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>Remplissez le formulaire pour ajouter un nouvel élève</li>
            <li>Tous les champs marqués d'un * sont obligatoires</li>
            <li>La liste des élèves s'actualise automatiquement</li>
            <li>Cliquez sur "Voir" pour afficher les détails d'un élève</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
