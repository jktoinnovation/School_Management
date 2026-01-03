import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bed, Users } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedReservations = JSON.parse(localStorage.getItem('hotel-reservations') || '[]');
    const savedRooms = JSON.parse(localStorage.getItem('hotel-rooms') || '[]');
    
    setReservations(savedReservations);
    setRooms(savedRooms);
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getReservationsForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return reservations.filter(reservation => {
      const checkIn = format(parseISO(reservation.checkInDate), 'yyyy-MM-dd');
      const checkOut = format(parseISO(reservation.checkOutDate), 'yyyy-MM-dd');
      return dateString >= checkIn && dateString <= checkOut;
    });
  };

  const getReservationsForRoom = (roomId) => {
    return reservations.filter(res => 
      res.roomId === roomId && 
      (res.status === 'confirmed' || res.status === 'checked-in')
    );
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Créer un tableau pour les jours de la semaine
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div>
      {/* En-tête du calendrier */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Calendrier des réservations</h2>
          <p className="text-gray-600 mt-1">
            Visualisez l'occupation de votre hôtel
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-l-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-2 border-x">
              <span className="font-medium">
                {format(currentDate, 'MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-r-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Arrivée</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Séjour</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Départ</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Aujourd'hui</span>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        {/* En-tête des jours */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Jours du mois */}
        <div className="grid grid-cols-7">
          {monthDays.map(day => {
            const dayReservations = getReservationsForDate(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toString()}
                className={`min-h-32 border border-gray-100 p-2 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isCurrentDay ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-medium ${isCurrentDay ? 'text-blue-600' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>
                    {format(day, 'd')}
                  </span>
                  {dayReservations.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {dayReservations.length}
                    </span>
                  )}
                </div>
                
                {/* Réservations pour ce jour */}
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {dayReservations.slice(0, 3).map(reservation => {
                    const isCheckIn = format(parseISO(reservation.checkInDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                    const isCheckOut = format(parseISO(reservation.checkOutDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                    
                    return (
                      <div
                        key={reservation.id}
                        className={`text-xs p-1 rounded truncate ${isCheckIn ? 'bg-blue-100 border border-blue-300' : isCheckOut ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'}`}
                        title={`${reservation.customerName} - Chambre ${reservation.roomNumber}`}
                      >
                        <div className="font-medium">Ch. {reservation.roomNumber}</div>
                        <div className="truncate">{reservation.customerName.split(' ')[0]}</div>
                      </div>
                    );
                  })}
                  {dayReservations.length > 3 && (
                    <div className="text-xs text-center text-gray-500">
                      +{dayReservations.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vue par chambre */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Bed size={20} className="mr-2" />
            Occupation par chambre
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chambre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client actuel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map(room => {
                const roomReservations = getReservationsForRoom(room.id);
                const currentReservation = roomReservations.find(res => 
                  res.status === 'checked-in'
                ) || roomReservations.find(res => 
                  res.status === 'confirmed'
                );
                
                return (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bed size={16} className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{room.roomNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize">{room.roomType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentReservation ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {currentReservation ? 'Occupée' : 'Disponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currentReservation ? (
                        <div>
                          <div className="font-medium text-gray-900">{currentReservation.customerName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Users size={14} className="mr-1" />
                            {currentReservation.guests} pers.
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currentReservation ? (
                        <div>
                          <div className="font-medium">
                            {format(parseISO(currentReservation.checkInDate), 'dd/MM')} - {format(parseISO(currentReservation.checkOutDate), 'dd/MM')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.ceil((new Date(currentReservation.checkOutDate) - new Date(currentReservation.checkInDate)) / (1000 * 60 * 60 * 24))} nuits
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {rooms.length === 0 && (
            <div className="text-center py-12">
              <Bed size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune chambre configurée</h3>
              <p className="text-gray-500">
                Configurez vos chambres pour voir l'occupation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques du mois */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-medium text-gray-700 mb-4">Occupation ce mois</h4>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">78%</p>
              <p className="text-gray-600 text-sm">Moyenne journalière</p>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-medium text-gray-700 mb-4">Réservations à venir</h4>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">42</p>
              <p className="text-gray-600 text-sm">Prochains 30 jours</p>
            </div>
            <CalendarIcon className="text-blue-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-medium text-gray-700 mb-4">Revenu prévu</h4>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">$12,450</p>
              <p className="text-gray-600 text-sm">Ce mois</p>
            </div>
            <div className="text-green-500 font-medium">+8%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;