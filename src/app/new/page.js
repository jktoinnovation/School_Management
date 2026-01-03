// app/new/page.js
'use client';

import { useRouter } from 'next/navigation';
import VisaApplicationForm from '@/components/VisaApplicationForm';
import { storage } from '@/lib/storage';

export default function NewApplicationPage() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    storage.saveApplication(formData);
    alert('Demande soumise avec succès !');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
      </div>
    </div>
  );
}