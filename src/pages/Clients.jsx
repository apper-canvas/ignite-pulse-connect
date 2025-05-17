import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import Sidebar from '../components/ui/Sidebar';

// Services
import { fetchClients, createClient, updateClient, deleteClient } from '../services/clientService';

// Components
import ClientForm from '../components/clients/ClientForm';
import ClientList from '../components/clients/ClientList';

// Icons
const UserPlus = getIcon('UserPlus');
const Search = getIcon('Search');
const LoadingSpinner = getIcon('Loader');
const PlusCircle = getIcon('PlusCircle');

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { user } = useSelector((state) => state.user);

  // Fetch clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Load clients from API
  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClients();
      
      // Map the data to our application structure
      const mappedClients = data.map(client => ({
        id: client.Id.toString(),
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zip: client.zip || '',
        industry: client.industry || '',
        notes: client.notes || '',
        tags: client.Tags ? client.Tags.split(',').filter(tag => tag.trim()) : [],
        Name: client.Name || '',
      }));
      
      setClients(mappedClients);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients. Please try again later.');
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    if (!searchQuery.trim()) return true;
    
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return (
      fullName.includes(searchLower) || 
      (client.email && client.email.toLowerCase().includes(searchLower)) ||
      (client.company && client.company.toLowerCase().includes(searchLower)) ||
      (client.phone && client.phone.toLowerCase().includes(searchLower)) ||
      (client.address && client.address.toLowerCase().includes(searchLower)) ||
      (client.city && client.city.toLowerCase().includes(searchLower)) ||
      (client.state && client.state.toLowerCase().includes(searchLower)) ||
      (client.industry && client.industry.toLowerCase().includes(searchLower))
    );
  });

  // Handle form submission for creating or updating client
  const handleSaveClient = async (formData, isEdit) => {
    try {
      if (isEdit && selectedClient) {
        // Prepare data for API
        const clientData = {
          Id: parseInt(selectedClient.id),
          firstName: formData.firstName,
          lastName: formData.lastName,
          Name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          industry: formData.industry,
          notes: formData.notes,
          Tags: formData.tags
        };
        
        // Update client in database
        await updateClient(clientData);
        
        // Update local state
        const updatedClients = clients.map(client => 
          client.id === selectedClient.id 
            ? { 
                ...client, 
                ...formData,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                industry: formData.industry,
                notes: formData.notes,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
              } 
            : client
        );
        
        setClients(updatedClients);
        toast.success("Client updated successfully!");
      } else {
        // Prepare data for API
        const clientData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          Name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          industry: formData.industry,
          notes: formData.notes,
          Tags: formData.tags
        };
        
        // Create client in database
        const createdClient = await createClient(clientData);
        
        // Add new client to local state with ID from server
        const newClient = {
          id: createdClient.Id.toString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          industry: formData.industry,
          notes: formData.notes,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        };
        
        setClients([...clients, newClient]);
        toast.success("Client added successfully!");
      }
      
      // Reset form and state
      setShowForm(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} client: ${error.message}`);
    }
  };

  // Handle edit client
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  // Handle delete client
  const handleDeleteClient = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }
    
    try {
      // Delete from database
      await deleteClient(parseInt(clientId));
      
      // Update local state
      setClients(clients.filter(client => client.id !== clientId));
      toast.info("Client deleted successfully");
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error(`Failed to delete client: ${error.message}`);
    }
  };

  return (
    <>
      <Sidebar activeRoute="clients" />
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
                  <UserPlus className="h-6 w-6" />
                </div>
                <span className="gradient-text">Clients</span>
              </h1>
              <p className="dashboard-subtitle max-w-2xl mt-2">
                Manage your clients, update their information, and track important details.
              </p>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {showForm ? (
              <ClientForm 
                client={selectedClient}
                onSave={handleSaveClient}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedClient(null);
                }}
              />
            ) : (
              <motion.div
                key="clients-content"
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
                      placeholder="Search clients..."
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
                      setSelectedClient(null);
                      setShowForm(true);
                    }}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    <span>Add Client</span>
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
                      onClick={loadClients}
                      className="btn btn-primary shadow-sm hover:shadow"
                     >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <ClientList 
                    clients={filteredClients}
                    searchQuery={searchQuery}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
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

export default Clients;