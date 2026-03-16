import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Box, Menu, X, ChevronDown, 
  User, Settings, LogOut, Hammer
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Mock Auth State (Set to true to see the profile dropdown in action)
  const isLoggedIn = false; 

  const navLinks = [
    { name: 'Marketplace', path: '/tools' },
    { name: 'How it Works', path: '/#how-it-works' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg group-hover:bg-blue-700 transition-colors">
              <Box className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              Tool<span className="text-blue-600">Share</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={(e) => handleScroll(e, link.path)}
                className={({ isActive }) => {
                  const isActuallyActive = isActive && !link.path.includes('#');
                  return `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActuallyActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`;
                }}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-4" />
            
            {isLoggedIn ? (
              /* User Profile Dropdown (NOW USED) */
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-slate-100 transition-all"
                >
                  <img 
                    src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" 
                    className="w-8 h-8 rounded-full border border-white shadow-sm"
                    alt="User"
                  />
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-150">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </Link>
                    <Link to="/my-tools" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Hammer className="w-4 h-4 mr-2" /> My Tools
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-3">
                <Link to="/auth/login" className="text-slate-600 hover:text-slate-900 font-semibold text-sm px-4">
                  Log in
                </Link>
                <Link to="/auth/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md active:scale-95">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={(e) => handleScroll(e, link.path)}
              className="block text-lg font-semibold text-slate-700"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-slate-100">
            {isLoggedIn ? (
               <div className="space-y-4">
                  <Link to="/profile" className="flex items-center text-lg font-semibold text-slate-700"><User className="mr-2" /> Profile</Link>
                  <button className="flex items-center text-lg font-semibold text-red-600"><LogOut className="mr-2" /> Sign Out</button>
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/auth/login" className="text-center py-3 font-bold text-slate-600 border border-slate-200 rounded-xl">Log in</Link>
                <Link to="/auth/register" className="text-center py-3 font-bold text-white bg-blue-600 rounded-xl">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;