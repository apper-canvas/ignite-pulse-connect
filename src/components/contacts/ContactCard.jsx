import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';
import { toast } from 'react-toastify';

// Icons
const Mail = getIcon('Mail');
const Phone = getIcon('Phone');
const Building = getIcon('Building');
const Edit2 = getIcon('Edit2');
const Trash2 = getIcon('Trash2');
const ArrowRight = getIcon('ArrowRight');
const Tag = getIcon('Tag');

// Animation for card
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

function ContactCard({ contact, onEdit, onDelete }) {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  
  return (
    <motion.div
      variants={item}
      className="card group hover:translate-y-[-4px] transition-transform"
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="flex justify-between">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-3 shadow-sm">
          <span className="text-lg font-semibold">
            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
          </span>
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(contact)}
            className="p-2 rounded-lg text-surface-500 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label={`Edit ${fullName}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(contact.id)}
            className="p-2 rounded-lg text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label={`Delete ${fullName}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-1">{fullName}</h3>
      
      {contact.position && contact.company && (
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
          {contact.position} at {contact.company}
        </p>
      )}
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <Mail className="w-4 h-4 mr-2 text-surface-500" />
          <a 
            href={`mailto:${contact.email}`} 
            className="text-primary hover:underline truncate"
            title={contact.email}
          >
            {contact.email}
          </a>
        </div>
        
        {contact.phone && (
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-surface-500" />
            <a href={`tel:${contact.phone}`} className="hover:text-primary">
              {contact.phone}
            </a>
          </div>
        )}
        
        {contact.company && (
          <div className="flex items-center text-sm">
            <Building className="w-4 h-4 mr-2 text-surface-500" />
            <span>{contact.company}</span>
          </div>
        )}
      </div>
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {contact.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ContactCard;