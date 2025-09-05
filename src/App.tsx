import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Fleet from './components/Fleet';
import Rentals from './components/Rentals';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from './components/ui';
import { LayoutDashboardIcon, CarIcon, FileTextIcon, CalendarDaysIcon, SettingsIcon, LogOutIcon } from './components/Icons';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for development
    const location = useLocation();

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }
    
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
        { path: '/fleet', label: 'Vozový park', icon: CarIcon },
        { path: '/rentals', label: 'Pronájmy', icon: FileTextIcon },
        { path: '/calendar', label: 'Kalendář', icon: CalendarDaysIcon },
        { path: '/settings', label: 'Nastavení', icon: SettingsIcon },
    ];
    
    return (
        <div className="flex h-screen bg-background text-text-primary">
            <aside className="w-64 bg-surface flex flex-col">
                <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
                    Rental<span className="text-accent">Manager</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                                }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 rounded-md text-left hover:bg-gray-700">
                        <LogOutIcon className="w-5 h-5 mr-3" />
                        Odhlásit se
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
                    <Route path="/fleet" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Fleet /></ProtectedRoute>} />
                    <Route path="/rentals" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Rentals /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CalendarView /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Settings /></ProtectedRoute>} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <ToastContainer />
        </div>
    );
};

export default App;
