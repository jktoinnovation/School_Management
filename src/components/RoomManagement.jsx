import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Bed, Users, Wifi, Tv, Coffee } from 'lucide-react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'standard',
    price: '',
    capacity: 1,
    description: '',
    amenities: []
  });

  const roomTypes = [
    { value: 'standard', label: 'Standard', color: 'bg-gray-100 text-gray-800' },
    { value: 'deluxe', label: 'Deluxe', color: 'bg-blue-100 text-blue-800' },
    { value: 'suite', label: 'Suite', color: 'bg-purple-100 text-purple-800' },
    { value: 'family', label: 'Familiale', color: 'bg-green-100 text-green-800' }
  ];

  const amenitiesList = [
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={16} /> },
    { id: 'tv', label: 'TV', icon: <Tv size={16} /> },
    { id: 'coffee', label: 'Machine à café', icon: <Coffee size={16} /> },
    { id: 'minibar', label: 'Minibar' },
    { id: 'ac', label: 'Air conditionné' },
    { id: 'safe', label: 'Coffre-fort' }
  ];

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const savedRooms = JSON.parse(localStorage.getItem('hotel-rooms') || '[]');
    setRooms(savedRooms);
  };

  const saveRooms = (roomsToSave) => {
    localStorage.setItem('hotel-rooms', JSON.stringify(roomsToSave));
    setRooms(roomsToSave);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => {
      const updatedAmenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities: updatedAmenities };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRoom = {
      id: editingRoom ? editingRoom.id : Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      status: 'available'
    };
    
    let updatedRooms;
    if (editingRoom) {
      updatedRooms = rooms.map(room => room.id === editingRoom.id ? newRoom : room);
    } else {
      updatedRooms = [...rooms, newRoom];
    }
    
    saveRooms(updatedRooms);
    resetForm();
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price.toString(),
      capacity: room.capacity,
      description: room.description,
      amenities: room.amenities || []
    });
    setShowForm(true);
  };

  const handleDelete = (roomId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      const updatedRooms = rooms.filter(room => room.id !== roomId);
      saveRooms(updatedRooms);
    }
  };

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      roomType: 'standard',
      price: '',
      capacity: 1,
      description: '',
      amenities: []
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const getRoomStatus = (roomId) => {
    const reservations = JSON.parse(localStorage.getItem('hotel-reservations') || '[]');
    const activeReservation = reservations.find(r => 
      r.roomId === roomId && (r.status === 'confirmed' || r.status === 'checked-in')
    );
    return activeReservation ? 'occupied' : 'available';
  };

  return (
    <div>
      {/* En-tête avec bouton d'ajout */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestion des chambres</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Ajouter une chambre
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  {editingRoom ? 'Modifier la chambre' : 'Nouvelle chambre'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de chambre *
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de chambre *
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {roomTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix par nuit ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacité (personnes) *
                    </label>
                    <select
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'personne' : 'personnes'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Équipements
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map(amenity => (
                      <label
                        key={amenity.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.amenities.includes(amenity.id) ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.id)}
                          onChange={() => handleAmenityToggle(amenity.id)}
                          className="mr-3"
                        />
                        {amenity.icon && <span className="mr-2">{amenity.icon}</span>}
                        <span>{amenity.label}</span>
                      </label>
                    ))}
                  </div>
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
                    {editingRoom ? 'Mettre à jour' : 'Ajouter la chambre'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Liste des chambres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => {
          const status = getRoomStatus(room.id);
          const roomType = roomTypes.find(t => t.value === room.roomType);
          
          return (
            <div key={room.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              {/* En-tête de la carte */}
              <div className={`p-4 ${status === 'occupied' ? 'bg-red-50' : 'bg-green-50'} border-b`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">Chambre {room.roomNumber}</h3>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${roomType?.color}`}>
                      {roomType?.label}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {status === 'occupied' ? 'Occupée' : 'Disponible'}
                  </span>
                </div>
              </div>

              {/* Corps de la carte */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users size={18} className="mr-2" />
                    <span>{room.capacity} {room.capacity === 1 ? 'personne' : 'personnes'}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    ${room.price}<span className="text-sm text-gray-600">/nuit</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  {room.description || 'Chambre confortable avec tout le nécessaire pour un séjour agréable.'}
                </p>

                {/* Équipements */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Équipements :</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 3).map(amenityId => {
                        const amenity = amenitiesList.find(a => a.id === amenityId);
                        return amenity ? (
                          <span key={amenityId} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {amenity.label}
                          </span>
                        ) : null;
                      })}
                      {room.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(room)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={16} className="mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {rooms.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow border border-gray-100 p-8 text-center">
            <Bed size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune chambre enregistrée</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre première chambre</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Ajouter une chambre
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;