import { useState, useEffect } from 'react';
import { Plus, Search, Calendar as CalendarIcon, User, Check, X } from 'lucide-react';
import { format } from 'date-fns';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: ''
  });

  const statusOptions = [
    { value: 'all', label: 'Toutes', color: 'gray' },
    { value: 'pending', label: 'En attente', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmée', color: 'blue' },
    { value: 'checked-in', label: 'En cours', color: 'green' },
    { value: 'checked-out', label: 'Terminée', color: 'purple' },
    { value: 'cancelled', label: 'Annulée', color: 'red' }
  ];

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const savedReservations = JSON.parse(localStorage.getItem('hotel-reservations') || '[]');
    // Trier par date de création (plus récent en premier)
    savedReservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setReservations(savedReservations);
  };

  const saveReservations = (reservationsToSave) => {
    localStorage.setItem('hotel-reservations', JSON.stringify(reservationsToSave));
    setReservations(reservationsToSave);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Récupérer les chambres pour calculer le prix
    const rooms = JSON.parse(localStorage.getItem('hotel-rooms') || '[]');
    const selectedRoom = rooms.find(room => room.id === formData.roomId);
    
    if (!selectedRoom) {
      alert('Veuillez sélectionner une chambre valide');
      return;
    }
    
    // Calculer le nombre de nuits
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const newReservation = {
      id: Date.now().toString(),
      ...formData,
      roomNumber: selectedRoom.roomNumber,
      roomType: selectedRoom.roomType,
      totalPrice: selectedRoom.price * nights,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Sauvegarder aussi le client s'il n'existe pas
    saveCustomerIfNew(formData);
    
    const updatedReservations = [newReservation, ...reservations];
    saveReservations(updatedReservations);
    resetForm();
  };

  const saveCustomerIfNew = (customerData) => {
    const customers = JSON.parse(localStorage.getItem('hotel-customers') || '[]');
    
    // Vérifier si le client existe déjà
    const existingCustomer = customers.find(c => 
      c.email === customerData.customerEmail || 
      c.phone === customerData.customerPhone
    );
    
    if (!existingCustomer) {
      const newCustomer = {
        id: Date.now().toString(),
        name: customerData.customerName,
        email: customerData.customerEmail,
        phone: customerData.customerPhone,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('hotel-customers', JSON.stringify([...customers, newCustomer]));
    }
  };

  const updateStatus = (reservationId, newStatus) => {
    const updatedReservations = reservations.map(reservation => 
      reservation.id === reservationId 
        ? { ...reservation, status: newStatus }
        : reservation
    );
    
    saveReservations(updatedReservations);
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      guests: 1,
      specialRequests: ''
    });
    setShowForm(false);
  };

  const getAvailableRooms = () => {
    const rooms = JSON.parse(localStorage.getItem('hotel-rooms') || '[]');
    const activeReservations = reservations.filter(r => 
      r.status === 'confirmed' || r.status === 'checked-in'
    );
    
    // Filtrer les chambres disponibles
    return rooms.filter(room => {
      const isOccupied = activeReservations.some(res => res.roomId === room.id);
      return !isOccupied;
    });
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.roomNumber?.toString().includes(searchTerm) ||
      reservation.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* En-tête avec filtres */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Gestion des réservations</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          
          {/* Filtre de statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Bouton d'ajout */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Formulaire de réservation */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Nouvelle réservation</h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Informations client */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <User size={18} className="mr-2" />
                    Informations client
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Nom complet *</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Email *</label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Nombre de voyageurs</label>
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sélection de chambre */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <CalendarIcon size={18} className="mr-2" />
                    Détails du séjour
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Date d'arrivée *</label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Date de départ *</label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={formData.checkOutDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Chambre *</label>
                    <select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Sélectionnez une chambre</option>
                      {getAvailableRooms().map(room => (
                        <option key={room.id} value={room.id}>
                          Chambre {room.roomNumber} - {room.roomType} - ${room.price}/nuit
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Demandes spéciales */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2">Demandes spéciales</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Préférences alimentaires, heure d'arrivée, etc."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Créer la réservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Liste des réservations */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chambre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map(reservation => {
                const statusOption = statusOptions.find(opt => opt.value === reservation.status);
                
                return (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{reservation.customerName}</div>
                        <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">Chambre {reservation.roomNumber}</div>
                      <div className="text-sm text-gray-500 capitalize">{reservation.roomType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">
                          {format(new Date(reservation.checkInDate), 'dd/MM/yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(reservation.checkOutDate), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">${reservation.totalPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${statusOption?.color}-100 text-${statusOption?.color}-800`}>
                        {statusOption?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(reservation.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => updateStatus(reservation.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(reservation.id, 'checked-in')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Check-in
                          </button>
                        )}
                        {reservation.status === 'checked-in' && (
                          <button
                            onClick={() => updateStatus(reservation.id, 'checked-out')}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Check-out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Créez votre première réservation pour commencer'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;