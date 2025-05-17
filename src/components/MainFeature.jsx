import React from 'react';
import TypeInfo from '../utils/typeInfo';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

import { fetchContacts, createContact, updateContact, deleteContact } from '../services/contactService';

// Icons
const Search = getIcon('Search');
const Edit2 = getIcon('Edit2');
const Trash2 = getIcon('Trash2');
const Phone = getIcon('Phone');
const Mail = getIcon('Mail');
const Building = getIcon('Building');
const ArrowRight = getIcon('ArrowRight');
const PlusCircle = getIcon('PlusCircle');
const XCircle = getIcon('XCircle');
const User = getIcon('User');
const AtSign = getIcon('AtSign');
const Briefcase = getIcon('Briefcase');
const Tag = getIcon('Tag');
const LoadingSpinner = getIcon('Loader');

function MainFeature({ activeTab }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
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
  
  // Fetch contacts from the database
  useEffect(() => {
    if (activeTab !== 'contacts') return;
    
    const loadContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchContacts();
        
        // Map the data to our application structure
        const mappedContacts = data.map(contact => ({
          id: contact.Id.toString(),
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company: contact.company || '',
          position: contact.position || '',
          leadSource: contact.leadSource || '',
          tags: contact.Tags ? contact.Tags.split(',').filter(tag => tag.trim()) : [],
          lastContactDate: contact.lastContactDate || new Date().toISOString().split('T')[0],
          Name: contact.Name || '',
          // Include other fields as needed
        }));
        
        setContacts(mappedContacts);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load contacts. Please try again later.');
        toast.error('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };
    
    loadContacts();
  }, [activeTab]);
  
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return (
      fullName.includes(searchLower) || 
      contact.email.toLowerCase().includes(searchLower) ||
      contact.company.toLowerCase().includes(searchLower)
    );
  });
  

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
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (selectedContact) {
        // Prepare data for API
        const contactData = {
          Id: parseInt(selectedContact.id),
          firstName: formData.firstName,
          lastName: formData.lastName,
          Name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          leadSource: formData.leadSource,
          Tags: formData.tags,
          lastContactDate: new Date().toISOString().split('T')[0]
        };
        
        // Update contact in database
        await updateContact(contactData);
        
        // Update local state
        const updatedContacts = contacts.map(contact => 
          contact.id === selectedContact.id 
            ? { 
                ...contact, 
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
              } 
            : contact
        );
        
        setContacts(updatedContacts);
        toast.success("Contact updated successfully!");
      } else {
        // Prepare data for API
        const contactData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          Name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          leadSource: formData.leadSource,
          Tags: formData.tags,
          lastContactDate: new Date().toISOString().split('T')[0]
        };
      // Add new contact
      const newContact = {
        id: Date.now().toString(),
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        lastContactDate: new Date().toISOString().split('T')[0]
      };

      // Create contact in database
      const createdContact = await createContact(contactData);
      
      // Add created contact to local state with ID from server
      newContact.id = createdContact.Id.toString();
      
      setContacts([...contacts, newContact]);
      toast.success("Contact added successfully!");
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact. Please try again.');
    } finally {
      setIsSubmitting(false);
      resetForm();
    }
  };
  

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      position: contact.position,
      leadSource: contact.leadSource,
      tags: contact.tags.join(', ')
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContactLoading(true);
      try {
        // Delete from database
        await deleteContact(parseInt(id));
        
        // Update local state
        setContacts(contacts.filter(contact => contact.id !== id));
        toast.info("Contact deleted successfully");
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact. Please try again.');
      } finally {
        setContactLoading(false);
      }
    }
    
    
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      leadSource: '',
      tags: ''
    });
    setSelectedContact(null);
    setShowAddForm(false);
    setErrors({});
  };

  if (activeTab !== 'contacts') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl sm:text-2xl font-medium text-surface-600 dark:text-surface-400 mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
        </h3>
        <p className="text-surface-500 dark:text-surface-500 max-w-md">
          This feature is under development. Please check back soon!
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {showAddForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {selectedContact ? "Edit Contact" : "Add New Contact"}
              </h3>
              <button
                onClick={resetForm}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                aria-label="Close form"
              >
                <XCircle className="w-6 h-6" />
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
                  onClick={resetForm}
                  className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {selectedContact ? "Update Contact" : "Add Contact"}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="contacts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={18} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="input-field pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary flex items-center"
                onClick={() => setShowAddForm(true)}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                <span>Add Contact</span>
              </motion.button>
            </div>

            {contactLoading && (
              <div className="flex justify-center items-center py-4">
                <LoadingSpinner className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-surface-600 dark:text-surface-400">Processing...</span>
              </div>
            )}

            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-surface-500 dark:text-surface-400 mb-4">
                  {searchQuery ? "No contacts match your search" : "No contacts found"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map(contact => (
                  <motion.div
                    key={contact.id}
                    className="card-neu group hover:translate-y-[-4px] transition-transform"
                    whileHover={{ scale: 1.01 }}
                    layout
                  >
                    <div className="flex justify-between">
                      <div className="w-12 h-12 rounded-full bg-primary-light/20 dark:bg-primary-dark/30 flex items-center justify-center text-primary-dark dark:text-primary-light mb-3">
                        <span className="text-lg font-semibold">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleEdit(contact)}
                          className="p-1.5 rounded-full text-surface-500 hover:text-primary hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                          aria-label="Edit contact"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(contact.id)}
                          className="p-1.5 rounded-full text-surface-500 hover:text-red-500 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                          aria-label="Delete contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{contact.firstName} {contact.lastName}</h3>
                    
                    {contact.position && contact.company && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                        {contact.position} at {contact.company}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-surface-500" />
                        <a href={`mailto:${contact.email}`} className="text-primary hover:underline truncate">
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
                            className="px-2 py-1 text-xs rounded-full bg-primary-light/20 dark:bg-primary-dark/30 text-primary-dark dark:text-primary-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                      <button 
                        className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light flex items-center"
                        onClick={() => toast.info(`Viewing details for ${contact.firstName} ${contact.lastName}`)}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;