import { motion } from 'framer-motion';
import ContactCard from './ContactCard';
import getIcon from '../../utils/iconUtils';

// Icons
const SearchIcon = getIcon('Search');

function ContactList({ contacts, searchQuery, onEdit, onDelete, onClearSearch }) {
  // Empty state when no contacts match search
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-400 dark:text-surface-500">
          <SearchIcon className="w-8 h-8 opacity-70" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">No results found</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md mx-auto">
          {searchQuery ? "No contacts match your search" : "No contacts found"}
        </p>
        {searchQuery && (
          <button
            onClick={onClearSearch} className="btn bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600 shadow-sm">Clear Search
          </button>
        )}
      </div>
    );
  }
  
  // Stagger animation for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {contacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </motion.div>
  );
}

export default ContactList;