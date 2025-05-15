import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

// Additional icons
const TrendingUp = getIcon('TrendingUp');
const TrendingDown = getIcon('TrendingDown');

function StatCard({ title, value, change, changeType, icon, color, variants }) {
  // Set color variants based on the color prop
  const colorClasses = {
    primary: "from-primary-400 to-primary-600 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20",
    secondary: "from-cyan-400 to-cyan-600 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20",
    amber: "from-amber-400 to-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
    green: "from-emerald-400 to-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  };
  
  const iconClasses = `w-8 h-8 p-1.5 rounded-lg bg-gradient-to-br ${colorClasses[color] || colorClasses.primary} text-white`;
  const changeTypeClasses = changeType === 'positive' 
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    
  return (
    <motion.div
      variants={variants}
      className="card"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={iconClasses}>
          {icon}
        </div>
        
        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${changeTypeClasses}`}>
          {changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-surface-600 dark:text-surface-400">{title}</p>
    </motion.div>
  );
}

export default StatCard;