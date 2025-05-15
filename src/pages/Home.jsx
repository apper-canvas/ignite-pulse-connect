import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Icons
const Users = getIcon('Users');
const BarChart = getIcon('BarChart');
const Calendar = getIcon('Calendar');
const ListTodo = getIcon('ListTodo');

function Home() {
  const [activeTab, setActiveTab] = useState('contacts');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    toast.info(`Switched to ${tab.charAt(0).toUpperCase() + tab.slice(1)} view`);
  };

  return (
    <div className="min-h-screen pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PulseConnect CRM
            </h1>
            <p className="mt-2 text-surface-600 dark:text-surface-400 max-w-2xl">
              Manage your customer relationships, track deals, and never miss a follow-up
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary flex items-center self-start"
            onClick={() => toast.success("New contact feature coming soon!")}
          >
            <span className="mr-2">+ Add Contact</span>
          </motion.button>
        </div>

        <div className="card-neu p-0 overflow-hidden">
          <div className="flex flex-wrap border-b border-surface-200 dark:border-surface-700">
            <TabButton 
              label="Contacts" 
              icon={<Users className="w-5 h-5 mr-2" />}
              active={activeTab === 'contacts'} 
              onClick={() => handleTabChange('contacts')} 
            />
            <TabButton 
              label="Deals" 
              icon={<BarChart className="w-5 h-5 mr-2" />}
              active={activeTab === 'deals'} 
              onClick={() => handleTabChange('deals')} 
            />
            <TabButton 
              label="Calendar" 
              icon={<Calendar className="w-5 h-5 mr-2" />}
              active={activeTab === 'calendar'} 
              onClick={() => handleTabChange('calendar')} 
            />
            <TabButton 
              label="Tasks" 
              icon={<ListTodo className="w-5 h-5 mr-2" />}
              active={activeTab === 'tasks'} 
              onClick={() => handleTabChange('tasks')} 
            />
          </div>
          
          <div className="p-6">
            <MainFeature activeTab={activeTab} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }) {
  return (
    <button
      className={`relative inline-flex items-center px-4 py-3 text-sm font-medium transition-all duration-200
        ${active 
          ? 'text-primary dark:text-primary-light border-b-2 border-primary dark:border-primary-light' 
          : 'text-surface-600 dark:text-surface-400 hover:text-primary hover:dark:text-primary-light'
        }
      `}
      onClick={onClick}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

export default Home;