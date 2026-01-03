import { useState, useEffect } from 'react';
import { Users, Bed, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalCustomers: 0,
    todayCheckins: 0,
    todayCheckouts: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    // Charger les données depuis localStorage
    const loadStats = () => {
      const rooms = JSON.parse(localStorage.getItem('hotel-rooms') || '[]');
      const reservations = JSON.parse(localStorage.getItem('hotel-reservations') || '[]');
      const customers = JSON.parse(localStorage.getItem('hotel-customers') || '[]');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Calculer les statistiques
      const totalRooms = rooms.length;
      const occupiedRooms = reservations.filter(r => 
        r.status === 'confirmed' || r.status === 'checked-in'
      ).length;
      const availableRooms = totalRooms - occupiedRooms;
      const totalCustomers = customers.length;
      
      const todayCheckins = reservations.filter(r => 
        r.checkInDate === today && (r.status === 'confirmed' || r.status === 'checked-in')
      ).length;
      
      const todayCheckouts = reservations.filter(r => 
        r.checkOutDate === today && (r.status === 'checked-in' || r.status === 'confirmed')
      ).length;
      
      // Revenu mensuel (simulé)
      const monthlyRevenue = reservations
        .filter(r => r.status === 'checked-out')
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
      
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      
      setStats({
        totalRooms,
        occupiedRooms,
        availableRooms,
        totalCustomers,
        todayCheckins,
        todayCheckouts,
        monthlyRevenue,
        occupancyRate
      });
    };
    
    loadStats();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      loadStats();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Polling pour les mises à jour (car storage event ne se déclenche pas dans le même onglet)
    const interval = setInterval(loadStats, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  const statCards = [
    {
      title: 'Chambres occupées',
      value: `${stats.occupiedRooms}/${stats.totalRooms}`,
      icon: <Bed className="text-blue-600" size={24} />,
      color: 'blue',
      change: '+2 cette semaine',
      trend: 'up'
    },
    {
      title: 'Taux d\'occupation',
      value: `${stats.occupancyRate}%`,
      icon: <TrendingUp className="text-green-600" size={24} />,
      color: 'green',
      change: '+5% depuis hier',
      trend: 'up'
    },
    {
      title: 'Clients aujourd\'hui',
      value: stats.todayCheckins,
      icon: <Users className="text-purple-600" size={24} />,
      color: 'purple',
      change: `${stats.todayCheckouts} départs`,
      trend: 'neutral'
    },
    {
      title: 'Revenu mensuel',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: <DollarSign className="text-orange-600" size={24} />,
      color: 'orange',
      change: '+12% ce mois',
      trend: 'up'
    }
  ];
  
  return (
    <div>
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm ${card.trend === 'up' ? 'text-green-600' : card.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-${card.color}-50`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Graphiques et autres informations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aperçu des réservations récentes */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Réservations récentes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Chambre {201 + i}</p>
                  <p className="text-sm text-gray-600">M. Dupont • 2 nuits</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">$450</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Confirmée
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Statistiques d'occupation */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Occupation cette semaine</h2>
          <div className="space-y-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
              const percentage = Math.floor(Math.random() * 40) + 60;
              return (
                <div key={day} className="flex items-center">
                  <span className="w-12 text-gray-600">{day}</span>
                  <div className="flex-1 ml-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right font-medium">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Notes et rappels */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Notes et rappels</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700">Nettoyage programmé pour les chambres 205-210 à 10h</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700">Arrivée groupe de 15 personnes demain à 14h</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700">Maintenance de l'ascenseur prévue vendredi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;