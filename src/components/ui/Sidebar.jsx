import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../App';
import getIcon from '../../utils/iconUtils';

// Icons
const Home = getIcon('Home');
const Users = getIcon('Users');
const BarChart = getIcon('BarChart');
const Settings = getIcon('Settings');
const UserPlus = getIcon('UserPlus');
const LogOut = getIcon('LogOut');
const ChevronRight = getIcon('ChevronRight');
const ChevronLeft = getIcon('ChevronLeft');
const ListTodo = getIcon('ListTodo');

const sidebarVariants = {
  open: { 
    width: '256px',
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
  closed: { 
    width: '64px',
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  
  return (
    <motion.div 
      className="fixed top-16 left-0 h-full bg-white dark:bg-surface-800 shadow-md z-30 transform overflow-y-auto
                overflow-x-hidden transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-300"
      variants={sidebarVariants}
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
    >
      <div className="py-4 px-2 flex flex-col h-full">
        <div className="flex-grow">
          <ul className="space-y-1">
            <NavItem 
              to="/dashboard" 
              icon={<Home />} 
              label="Dashboard" 
              isOpen={isOpen}
              isActive={location.pathname === '/dashboard'}
            />
            <NavItem 
              to="/contacts" 
              icon={<Users />} 
              label="Contacts" 
              isOpen={isOpen}
              isActive={location.pathname === '/contacts'}
            />
            <NavItem 
              to="/clients" 
              icon={<UserPlus />} 
              label="Clients" 
              isOpen={isOpen}
              isActive={location.pathname === '/clients'}
            />
            <NavItem 
              to="/tasks" 
              icon={<ListTodo />} 
              label="Tasks" 
              isOpen={isOpen}
              isActive={location.pathname === '/tasks'}
            />
            <NavItem 
              to="/deals" 
              icon={<BarChart />} 
              label="Deals" 
              isOpen={isOpen}
              isActive={location.pathname === '/deals'}
            />
          </ul>
        </div>
        
        <div className="pt-6 border-t border-surface-200 dark:border-surface-700 mt-6">
          <ul className="space-y-1">
            <NavItem 
              to="/settings" 
              icon={<Settings />} 
              label="Settings" 
              isOpen={isOpen}
              isActive={location.pathname === '/settings'}
            />
            <li>
              <button 
                className="w-full flex items-center text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 
                         rounded-lg p-2 transition-colors duration-200"
                onClick={logout}
              >
                <span className="text-lg inline-block w-8">
                  <LogOut />
                </span>
                {isOpen && <span className="ml-2">Logout</span>}
              </button>
            </li>
            <li>
              <button 
                className="w-full flex items-center text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 
                         rounded-lg p-2 transition-colors duration-200"
                onClick={toggleSidebar}
                aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <span className="text-lg inline-block w-8">
                  {isOpen ? <ChevronLeft /> : <ChevronRight />}
                </span>
                {isOpen && <span className="ml-2">{isOpen ? "Collapse" : "Expand"}</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const NavItem = ({ to, icon, label, isOpen, isActive }) => (
  <li>
    <NavLink to={to} className={`flex items-center text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 
                           rounded-lg p-2 transition-colors duration-200 ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' : ''}`}>
      <span className="text-lg inline-block w-8">{icon}</span>
      {isOpen && <span className="ml-2">{label}</span>}
    </NavLink>
  </li>
);

export default Sidebar;