import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Sidebar from '../components/ui/Sidebar';
import StatCard from '../components/dashboard/StatCard';

// Icons
const Users = getIcon('Users');
const BarChart = getIcon('BarChart');
const Calendar = getIcon('Calendar');
const ListTodo = getIcon('ListTodo');
const TrendingUp = getIcon('TrendingUp');
const Activity = getIcon('Activity');
const Zap = getIcon('Zap');
const CheckCircle = getIcon('CheckCircle');
const Clock = getIcon('Clock');
const ArrowRight = getIcon('ArrowRight');

function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <Sidebar activeRoute="dashboard" />
      <div className="dashboard-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dashboard-content"
        >
          <div className="dashboard-header">
            <div>
              <motion.h1 
                className="dashboard-title gradient-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Welcome back, {user?.firstName || 'User'}!
              </motion.h1>
              <motion.p 
                className="dashboard-subtitle max-w-2xl mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Your CRM dashboard is ready. Manage your contacts, deals and tasks efficiently.
              </motion.p>
            </div>
            
            <div className="flex space-x-2 rounded-xl bg-white/80 dark:bg-surface-800/80 shadow-sm p-1 border border-surface-200 dark:border-surface-700 backdrop-blur-sm">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm' 
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('performance')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'performance' 
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm' 
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Performance
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="space-y-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <StatCard 
                variants={item}
                title="Total Contacts"
                value="128"
                change="+12%"
                changeType="positive"
                icon={<Users />}
                color="primary"
              />
              <StatCard 
                variants={item}
                title="Active Deals"
                value="24"
                change="+5%"
                changeType="positive"
                icon={<BarChart />}
                color="secondary"
              />
              <StatCard 
                variants={item}
                title="Tasks Completed"
                value="78"
                change="+18%"
                changeType="positive"
                icon={<CheckCircle />}
                color="green"
              />
              <StatCard 
                variants={item}
                title="Pending Tasks"
                value="12"
                change="-3%"
                changeType="negative"
                icon={<Clock />}
                color="amber"
              />
            </motion.div>
          </div>
          
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
          >
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/contacts" className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-all group border border-primary-100/50 dark:border-primary-800/30 hover:shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Manage Contacts</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400">View and manage your contacts</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </Link>
              
              {/* Additional quick action links would go here */}
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </>
  );
}

export default Dashboard;