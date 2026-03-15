import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LayoutDashboard, LogOut, Search } from 'lucide-react';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">JobFlow AI</span>
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/jobs" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 flex items-center gap-2">
                <Search className="w-4 h-4" /> Find Jobs
              </Link>
              <Link to="/profile" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-zinc-600 hover:text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
