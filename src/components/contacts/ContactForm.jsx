import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

// Icons
const User = getIcon('User');
const AtSign = getIcon('AtSign');
const Phone = getIcon('Phone');
const Building = getIcon('Building');
const Briefcase = getIcon('Briefcase');
const Tag = getIcon('Tag');
const XCircle = getIcon('XCircle');
const LoadingSpinner = getIcon('Loader');

function ContactForm({ contact, onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    leadSource: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});
  
  // Initialize form with contact data if editing
  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        position: contact.position || '',
        leadSource: contact.leadSource || '',
        tags: Array.isArray(contact.tags) ? contact.tags.join(', ') : ''
      });
    }
  }, [contact]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData, !!contact);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      key="contact-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary flex items-center justify-center mr-2">
            {contact ? <User className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          </div>
          {contact ? "Edit Contact" : "Add New Contact"}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors">
          <XCircle className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`input-field pl-10 ${errors.firstName ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="First Name"
            />
          </div>
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`input-field pl-10 ${errors.lastName ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="Last Name"
            />
          </div>
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input-field pl-10 ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="Email Address"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Phone Number"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Company
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Company Name"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Position
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Job Title"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Lead Source
          </label>
          <select
            name="leadSource"
            value={formData.leadSource}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Conference">Conference</option>
            <option value="Social Media">Social Media</option>
            <option value="Email Campaign">Email Campaign</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Tags
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Tags (comma-separated)"
            />
          </div>
        </div>
        
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} shadow-sm hover:shadow`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="w-4 h-4 mr-2 animate-spin" />
                <span>{contact ? "Updating..." : "Saving..."}</span>
              </>
            ) : ( 
              contact ? "Update Contact" : "Add Contact"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default ContactForm;