import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

// Additional icons
const TrendingUp = getIcon('TrendingUp');
const TrendingDown = getIcon('TrendingDown');

function StatCard({ title, value, change, changeType, icon, color, variants }) {
  // Set color variants based on the color prop
  const colorClasses = {
    primary: {
      gradient: "from-primary-400 to-primary-600",
      bg: "bg-primary-50 dark:bg-primary-900/20",
      text: "text-primary-600 dark:text-primary-400",
      border: "border-primary-200/50 dark:border-primary-800/30"
    },
    secondary: {
      gradient: "from-cyan-400 to-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200/50 dark:border-cyan-800/30"
    },
    amber: {
      gradient: "from-amber-400 to-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200/50 dark:border-amber-800/30"
    },
    green: {
      gradient: "from-emerald-400 to-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200/50 dark:border-emerald-800/30"
    }
  };
  
  const colorSet = colorClasses[color] || colorClasses.primary;
  const iconClasses = `w-10 h-10 p-2 rounded-xl bg-gradient-to-br ${colorSet.gradient} text-white shadow-sm`;
  const changeTypeClasses = changeType === 'positive' 
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30' 
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30';
    
  return (
    <motion.div
      variants={variants}
      className="card border-l-4 group hover:scale-[1.02]"
      style={{ borderLeftColor: `var(--${color === 'primary' ? 'primary' : (color === 'secondary' ? 'secondary' : (color === 'green' ? 'emerald' : 'amber'))}-500)` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={iconClasses}>
          <motion.div whileHover={{ rotate: 10 }} className="group-hover:scale-110 transition-transform">
            {icon}
          </motion.div>
        </div>
        
        <div className={`flex items-center text-xs font-medium px-2.5 py-1.5 rounded-full ${changeTypeClasses} shadow-sm`}>
          {changeType === 'positive' ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          {change}
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">{value}</h3>
      <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">{title}</p>
    </motion.div>
  );
}

export default StatCard;