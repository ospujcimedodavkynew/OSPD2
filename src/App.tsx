// Populating placeholder file with the main App component.
import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from './context/DataContext';
import Dashboard from './components/Dashboard';
import Fleet from './components/Fleet';
import Rentals from './components/Rentals';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { DashboardIcon, CarIcon, DocumentTextIcon, CalendarIcon, SettingsIcon, LogoutIcon } from './components/Icons';
import { ToastContainer } from './components/ui';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}>
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <aside className="w-64 bg-gray-900 p-4 flex flex-col">
                <div className="text-2xl font-bold mb-8 text-center">Rental<span className="text-accent">Manager</span></div>
                <nav className="flex-1 space-y-2">
                    <NavLink to="/" icon={<DashboardIcon className="w-5 h-5" />}>Přehled</NavLink>
                    <NavLink to="/fleet" icon={<CarIcon className="w-5 h-5" />}>Vozový park</NavLink>
                    <NavLink to="/rentals" icon={<DocumentTextIcon className="w-5 h-5" />}>Pronájmy</NavLink>
                    <NavLink to="/calendar" icon={<CalendarIcon className="w-5 h-5" />}>Kalendář</NavLink>
                    <NavLink to="/settings" icon={<SettingsIcon className="w-5 h-5" />}>Nastavení</NavLink>
                </nav>
                 <button onClick={handleLogout} className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-surface hover:text-text-primary">
                    <LogoutIcon className="w-5 h-5 mr-3" />
                    Odhlásit se
                </button>
            </aside>
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
            <ToastContainer />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/fleet" element={<Fleet />} />
                    <Route path="/rentals" element={<Rentals />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
