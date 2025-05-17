import { useContext, useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import getIcon from '../../utils/iconUtils';
import Sidebar from './Sidebar';

// Icons
const User = getIcon('User');
const Sun = getIcon('Sun');
const Moon = getIcon('Moon');
const Menu = getIcon('Menu');
const LogOut = getIcon('LogOut');
const Settings = getIcon('Settings');
const ChevronDown = getIcon('ChevronDown');

function Navbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setProfileOpen(false);
    if (profileOpen) {
      document.addEventListener('click', closeDropdown);
    }
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
  };

  // Close sidebar on mobile when changing routes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="bg-white dark:bg-surface-800 shadow-md dark:shadow-surface-700/30 py-2 px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <button 
            className="lg:mr-3 text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light p-2 rounded-lg lg:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Toggle mobile menu"
          >
            <Menu />
          </button>
          
          <NavLink to="/dashboard" className="text-lg font-semibold text-primary dark:text-primary-light mr-2 md:mr-6">
            PulseConnect
          </NavLink>
          
          <button
            className="hidden lg:flex text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light p-2 rounded-lg mr-2"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu />
          </button>
        </div>

        <div className="flex items-center">
          <button 
            onClick={toggleDarkMode}
            className="p-2 mr-2 text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light rounded-full"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
          
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="w-8 h-8 bg-primary-light/10 text-primary-dark dark:bg-primary-dark/20 dark:text-primary-light rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="hidden md:block font-medium">{user?.firstName || 'User'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {profileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 shadow-lg rounded-lg py-1 z-50 border border-surface-200 dark:border-surface-700"
              >
                <button className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </button>
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

export default Navbar;