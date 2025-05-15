import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Sidebar from '../components/ui/Sidebar';

// Services
import { fetchContacts, createContact, updateContact, deleteContact } from '../services/contactService';

// Components
import ContactForm from '../components/contacts/ContactForm';
import ContactList from '../components/contacts/ContactList';

// Icons
const Users = getIcon('Users');
const Search = getIcon('Search');
const LoadingSpinner = getIcon('Loader');
const PlusCircle = getIcon('PlusCircle');
const LogOut = getIcon('LogOut');

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const { user } = useSelector((state) => state.user);

  // Fetch contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Load contacts from API
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

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery.trim()) return true;
    
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return (
      fullName.includes(searchLower) || 
      (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchLower))
    );
  });

  // Handle form submission for creating or updating contact
  const handleSaveContact = async (formData, isEdit) => {
    try {
      if (isEdit && selectedContact) {
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
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                position: formData.position,
                leadSource: formData.leadSource,
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
        
        // Create contact in database
        const createdContact = await createContact(contactData);
        
        // Add new contact to local state with ID from server
        const newContact = {
          id: createdContact.Id.toString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          leadSource: formData.leadSource,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
          lastContactDate: new Date().toISOString().split('T')[0]
        };
        
        setContacts([...contacts, newContact]);
        toast.success("Contact added successfully!");
      }
      
      // Reset form and state
      setShowForm(false);
      setSelectedContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} contact: ${error.message}`);
    }
  };

  // Handle edit contact
  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  // Handle delete contact
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }
    
    try {
      // Delete from database
      await deleteContact(parseInt(contactId));
      
      // Update local state
      setContacts(contacts.filter(contact => contact.id !== contactId));
      toast.info("Contact deleted successfully");
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to delete contact: ${error.message}`);
    }
  };

  return (
    <>
      <Sidebar activeRoute="contacts" />
      <div className="dashboard-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dashboard-content"
        >
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <span className="gradient-text">Contacts</span>
              </h1>
              <p className="dashboard-subtitle max-w-2xl mt-2">
                Manage your contacts, add new leads, and track important information.
              </p>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {showForm ? (
              <ContactForm 
                contact={selectedContact}
                onSave={handleSaveContact}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedContact(null);
                }}
              />
            ) : (
              <motion.div
                key="contacts-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
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
                    className="btn btn-primary flex items-center shadow-sm hover:shadow"
                    onClick={() => {
                      setSelectedContact(null);
                      setShowForm(true);
                    }}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    <span>Add Contact</span>
                  </motion.button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <LoadingSpinner className="w-10 h-10 text-primary animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button 
                      onClick={loadContacts}
                      className="btn btn-primary shadow-sm hover:shadow"
                     >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <ContactList 
                    contacts={filteredContacts}
                    searchQuery={searchQuery}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    onClearSearch={() => setSearchQuery('')}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

export default Contacts;