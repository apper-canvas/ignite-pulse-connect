import { motion } from 'framer-motion';
import ContactCard from './ContactCard';

function ContactList({ contacts, searchQuery, onEdit, onDelete, onClearSearch }) {
  // Empty state when no contacts match search
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-surface-500 dark:text-surface-400 mb-4">
          {searchQuery ? "No contacts match your search" : "No contacts found"}
        </p>
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
          >
            Clear Search
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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