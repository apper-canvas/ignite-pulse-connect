import { motion, AnimatePresence } from 'framer-motion';
import ClientCard from './ClientCard';
import getIcon from '../../utils/iconUtils';

// Icons
const XCircle = getIcon('XCircle');
const AlertTriangle = getIcon('AlertTriangle');

// Animation variants for staggered list items
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function ClientList({ clients, searchQuery, onEdit, onDelete, onClearSearch }) {
  // If no clients are found after searching
  if (clients.length === 0 && searchQuery) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-3">No clients found</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md mx-auto">
          No clients match your search for "{searchQuery}"
        </p>
        <button 
          onClick={onClearSearch}
          className="btn bg-white dark:bg-surface-700 text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center mx-auto border border-surface-200 dark:border-surface-600"
          >
          <XCircle className="w-4 h-4 mr-2" />
          Clear Search
        </button>
      </div>
    );
  }
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {clients.map(client => (
        <ClientCard key={client.id} client={client} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </motion.div>
  );
}

export default ClientList;