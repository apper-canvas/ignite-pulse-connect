import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import getIcon from '../../utils/iconUtils';

// Icons
const Sun = getIcon('Sun');
const Moon = getIcon('Moon');
const ChevronDown = getIcon('ChevronDown');
const LogOut = getIcon('LogOut');
const Menu = getIcon('Menu');
const X = getIcon('X');
const User = getIcon('User');

function Navbar({ darkMode, toggleDarkMode }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowProfileMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-white/90 dark:bg-surface-800/90 border-b border-surface-200 dark:border-surface-700 px-4 py-3 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors active:scale-95"
            onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Logo/Brand */}
          <Link to="/dashboard" className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold mr-2 shadow-sm animate-pulse-slow">
              <span className="text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-surface-800 dark:text-white">PulseConnect</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              toggleDarkMode();
            }}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors shadow-sm"
            whileTap={{ scale: 0.9 }}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          {/* User Profile Menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-sm overflow-hidden group">
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-surface-800 rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <span className="font-medium text-surface-800 dark:text-white text-sm block">{user?.firstName || 'User'}</span>
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  {user?.emailAddress ? user?.emailAddress.split('@')[0] : 'user'}@...</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-surface-800/95 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden z-50 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white shadow-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-surface-900 dark:text-white">{user?.firstName} {user?.lastName}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.emailAddress}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center text-red-600 dark:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;