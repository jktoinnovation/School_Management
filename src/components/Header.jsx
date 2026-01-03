import { Hotel } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X size={24} />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          )}
          
          <div className="flex items-center">
            <Hotel className="text-blue-600 mr-2" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Hôtel JKTO</h1>
              <p className="text-sm text-gray-600">Système de gestion</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <p className="font-medium text-gray-800">Administrateur</p>
            <p className="text-sm text-gray-600">admin@hotelpremium.com</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="font-bold text-blue-600">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;