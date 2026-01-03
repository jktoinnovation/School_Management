import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit, Trash2, Search, Star } from 'lucide-react';
import { format } from 'date-fns';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const savedCustomers = JSON.parse(localStorage.getItem('hotel-customers') || '[]');
    // Trier par date de création (plus récent en premier)
    savedCustomers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setCustomers(savedCustomers);
  };

  const saveCustomers = (customersToSave) => {
    localStorage.setItem('hotel-customers', JSON.stringify(customersToSave));
    setCustomers(customersToSave);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCustomer = {
      id: editingCustomer ? editingCustomer.id : Date.now().toString(),
      ...formData,
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    let updatedCustomers;
    if (editingCustomer) {
      updatedCustomers = customers.map(customer => 
        customer.id === editingCustomer.id ? newCustomer : customer
      );
    } else {
      updatedCustomers = [...customers, newCustomer];
    }
    
    saveCustomers(updatedCustomers);
    resetForm();
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || ''
    });
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      const updatedCustomers = customers.filter(customer => customer.id !== customerId);
      saveCustomers(updatedCustomers);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setEditingCustomer(null);
  };

  const getCustomerReservations = (customerEmail) => {
    const reservations = JSON.parse(localStorage.getItem('hotel-reservations') || '[]');
    return reservations.filter(res => res.customerEmail === customerEmail);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  return (
    <div>
      {/* En-tête avec recherche */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestion des clients</h2>
          <p className="text-gray-600 mt-1">{customers.length} clients enregistrés</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {/* Barre de recherche */}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          
          {/* Bouton d'ajout */}
          {!editingCustomer && (
            <button
              onClick={() => setEditingCustomer({})}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User size={20} className="mr-2" />
              Nouveau client
            </button>
          )}
        </div>
      </div>

      {/* Formulaire d'édition */}
      {editingCustomer !== null && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              {editingCustomer.id ? 'Modifier le client' : 'Nouveau client'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Préférences, allergies, remarques importantes..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingCustomer.id ? 'Mettre à jour' : 'Ajouter le client'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => {
          const reservations = getCustomerReservations(customer.email);
          const totalSpent = reservations.reduce((sum, res) => sum + (res.totalPrice || 0), 0);
          
          return (
            <div key={customer.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              {/* En-tête de la carte */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800">{customer.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                        <span>Client {reservations.length > 2 ? 'Fidèle' : 'Nouveau'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Corps de la carte */}
              <div className="p-4">
                {/* Informations de contact */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-3 text-gray-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-3 text-gray-400" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-3 text-gray-400" />
                    <span>
                      Client depuis {format(new Date(customer.createdAt), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>

                {/* Adresse */}
                {customer.address && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Adresse</p>
                    <p className="text-gray-700">{customer.address}</p>
                  </div>
                )}

                {/* Notes */}
                {customer.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700 text-sm">{customer.notes}</p>
                  </div>
                )}

                {/* Statistiques */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{reservations.length}</p>
                      <p className="text-sm text-gray-600">Séjours</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">${totalSpent}</p>
                      <p className="text-sm text-gray-600">Total dépensé</p>
                    </div>
                  </div>
                </div>

                {/* Réservations récentes */}
                {reservations.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Dernier séjour</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          Chambre {reservations[0].roomNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(reservations[0].checkInDate), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reservations[0].status === 'checked-out' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {reservations[0].status === 'checked-out' ? 'Terminé' : 'En cours'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow border border-gray-100 p-12 text-center">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchTerm ? 'Aucun client trouvé' : 'Aucun client enregistré'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Essayez une autre recherche' 
                : 'Commencez par ajouter votre premier client'}
            </p>
            {!editingCustomer && !searchTerm && (
              <button
                onClick={() => setEditingCustomer({})}
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User size={20} className="mr-2" />
                Ajouter un client
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;