'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function EleveList() {
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEleves = async () => {
    try {
      const { data, error } = await supabase
        .from('eleves')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEleves(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEleve = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cet élève ?')) {
      try {
        const { error } = await supabase
          .from('eleves')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchEleves();
        alert('Élève supprimé avec succès');
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          Liste des élèves ({eleves.length})
        </h2>
      </div>

      {eleves.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun élève enregistré</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom & Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de naissance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eleves.map((eleve) => (
                <tr key={eleve.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {eleve.nom} {eleve.prenom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {eleve.adresse}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {eleve.classe}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {eleve.telephone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {eleve.date_naissance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/eleves/${eleve.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => deleteEleve(eleve.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}