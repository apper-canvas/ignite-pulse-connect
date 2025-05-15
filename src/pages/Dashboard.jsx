import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useContext } from 'react';
import { AuthContext } from '../App';

// Icons
const Users = getIcon('Users');
const BarChart = getIcon('BarChart');
const Calendar = getIcon('Calendar');
const ListTodo = getIcon('ListTodo');
const LogOut = getIcon('LogOut');

function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  
  return (
    <div className="dashboard-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-content"
      >
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome, {user?.firstName || 'User'}!
            </h1>
            <p className="dashboard-subtitle max-w-2xl">
              Your CRM dashboard is ready. Manage your contacts, deals and tasks efficiently.
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn flex items-center self-start bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;