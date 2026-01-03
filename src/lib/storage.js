// lib/storage.js

const STORAGE_KEY = 'visa-applications';

export const storage = {
  // Récupérer toutes les demandes
  getAllApplications: () => {
    if (typeof window === 'undefined') return [];
    
    const applications = localStorage.getItem(STORAGE_KEY);
    return applications ? JSON.parse(applications) : [];
  },

  // Récupérer une demande par ID
  getApplication: (id) => {
    const applications = storage.getAllApplications();
    return applications.find(app => app.id === id);
  },

  // Sauvegarder une nouvelle demande
  saveApplication: (application) => {
    const applications = storage.getAllApplications();
    const newApplication = {
      ...application,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    applications.push(newApplication);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    return newApplication;
  },

  // Mettre à jour une demande
  updateApplication: (id, updates) => {
    const applications = storage.getAllApplications();
    const index = applications.findIndex(app => app.id === id);
    
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
      return applications[index];
    }
    
    return null;
  },

  // Supprimer une demande
  deleteApplication: (id) => {
    const applications = storage.getAllApplications();
    const filteredApplications = applications.filter(app => app.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredApplications));
    return true;
  },

  // Obtenir des statistiques
  getStats: () => {
    const applications = storage.getAllApplications();
    
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  }
};