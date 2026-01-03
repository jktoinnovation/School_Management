import { X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, menuItems, isMobile }) => {
  return (
    <>
      {sidebarOpen && (
        <>
          {/* Overlay pour mobile */}
          {isMobile && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <aside className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="flex flex-col h-full">
              {/* Logo et fermeture */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <span className="font-bold text-gray-800">Hotel Management</span>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              {/* Menu */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          if (isMobile) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                
                {/* Statistiques résumées */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Aujourd'hui</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrivées</span>
                      <span className="font-bold text-green-600">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Départs</span>
                      <span className="font-bold text-blue-600">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupées</span>
                      <span className="font-bold text-orange-600">24/30</span>
                    </div>
                  </div>
                </div>
              </nav>
              
              {/* Footer sidebar */}
              <div className="p-4 border-t">
                <div className="text-center text-sm text-gray-500">
                  <p>Version 1.0.0</p>
                  <p className="mt-1">© 2023 Hotel Premium</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;