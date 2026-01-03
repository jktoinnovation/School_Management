// components/StatusBadge.js
'use client';

export default function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
    approved: { color: 'bg-green-100 text-green-800', label: 'Approuvé' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejeté' },
    processing: { color: 'bg-blue-100 text-blue-800', label: 'En traitement' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}