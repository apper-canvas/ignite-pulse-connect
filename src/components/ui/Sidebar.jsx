import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

// Icons
const ChevronRight = getIcon('ChevronRight');
const Home = getIcon('Home');
const Users = getIcon('Users');
const BarChart = getIcon('BarChart');
const ListTodo = getIcon('ListTodo');
const Settings = getIcon('Settings');

function Sidebar({ activeRoute }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const sidebarClass = collapsed 
    ? 'w-16 transition-all duration-300 ease-in-out' 
    : 'w-64 transition-all duration-300 ease-in-out';
    
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Deals', icon: BarChart, path: '/deals' },
    { name: 'Clients', icon: getIcon('UserPlus'), path: '/clients' },
    { name: 'Tasks', icon: ListTodo, path: '/tasks' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed top-16 left-0 h-full hidden lg:block bg-white/95 dark:bg-surface-800/95 border-r border-surface-200 dark:border-surface-700 z-30 backdrop-blur-sm ${sidebarClass}`}>
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-6 flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 transition-colors active:scale-95"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = activeRoute === item.name.toLowerCase();
              const activeClass = isActive 
                ? 'bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent text-primary dark:text-primary-400 font-medium border-l-4 border-primary' 
                : 'text-surface-700 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700';
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg transition-colors ${activeClass}`}
                  style={{ paddingLeft: isActive ? '10px' : '12px' }}
                >
                  <div className="flex items-center">
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-surface-500 dark:text-surface-400'} ${isActive ? 'animate-pulse-slow' : ''}`} />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </div>
                  
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-5 bg-primary rounded-full shadow-glow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto">
            {!collapsed && (
              <div className="relative px-4 py-6 mx-2 mb-2 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/10 rounded-xl overflow-hidden border border-primary-200/50 dark:border-primary-800/20">
                {/* Decorative element */}
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/5"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/5"></div>
                
                <h4 className="text-sm font-medium text-primary mb-1">Need Help?</h4>
                <p className="text-xs text-surface-600 dark:text-surface-400">Check our documentation for help with your CRM setup.</p>
                <button className="mt-3 px-3 py-1.5 text-xs bg-white dark:bg-surface-800 text-primary rounded-lg border border-primary-200/50 dark:border-primary-800/20 hover:shadow-sm transition-shadow">
                  View Docs</button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;