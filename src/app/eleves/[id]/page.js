'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function EleveDetail() {
  const params = useParams();
  const router = useRouter();
  const [eleve, setEleve] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchEleve();
    }
  }, [params.id]);

  const fetchEleve = async () => {
    try {
      const { data, error } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setEleve(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!eleve) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Élève non trouvé</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Retour à la liste
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h1 className="text-3xl font-bold text-gray-800">
            Fiche élève : {eleve.nom} {eleve.prenom}
          </h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nom complet</h3>
                <p className="mt-1 text-lg">{eleve.nom} {eleve.prenom}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Classe</h3>
                <p className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {eleve.classe}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Date de naissance</h3>
                <p className="mt-1">{eleve.date_naissance}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                <p className="mt-1">{eleve.adresse}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                <p className="mt-1">{eleve.telephone}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Date d'inscription</h3>
                <p className="mt-1">
                  {new Date(eleve.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}