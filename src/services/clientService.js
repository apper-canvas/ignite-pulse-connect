// Client service for handling all client-related operations with Apper backend

// Fetch all clients
export async function fetchClients() {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      "Fields": [
        { "Field": { "Name": "Id" } },
        { "Field": { "Name": "Name" } },
        { "Field": { "Name": "Tags" } },
        { "Field": { "Name": "Owner" } },
        { "Field": { "Name": "firstName" } },
        { "Field": { "Name": "lastName" } },
        { "Field": { "Name": "email" } },
        { "Field": { "Name": "phone" } },
        { "Field": { "Name": "company" } },
        { "Field": { "Name": "address" } },
        { "Field": { "Name": "city" } },
        { "Field": { "Name": "state" } },
        { "Field": { "Name": "zip" } },
        { "Field": { "Name": "industry" } },
        { "Field": { "Name": "notes" } }
      ],
      "where": [
        {
          "fieldName": "IsDeleted",
          "Operator": "ExactMatch",
          "values": [false]
        }
      ],
      "orderBy": [
        {
          "field": "Name",
          "direction": "ASC"
        }
      ],
      "pagingInfo": {
        "limit": 50,
        "offset": 0
      }
    };

    const response = await apperClient.fetchRecords('client', params);

    // Handle empty data
    if (!response || !response.data || response.data.length === 0) {
      console.log("No clients found or empty response");
      return []; 
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}

// Fetch a single client by ID
export async function getClientById(clientId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('client', clientId);

    if (!response || !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    throw error;
  }
}

// Create a new client
export async function createClient(clientData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up record to create
    const params = {
      record: clientData
    };

    try {
      const response = await apperClient.createRecord('client', params);

      if (!response || !response.success || !response.data) {
        console.error('Failed to create client:', response);
        throw new Error('Failed to create client: ' + (response?.message || 'Unknown error'));
      }
      
      return response.data;
    } catch (apiError) {
      throw new Error(`API Error: ${apiError.message || 'Unknown error creating client'}`);
    }

  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

// Update an existing client
export async function updateClient(clientData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Client ID must be included in clientData
    if (!clientData.Id) {
      throw new Error('Client ID is required for updates');
    }

    // Set up record to update
    const params = {
      record: clientData
    };

    const response = await apperClient.updateRecord('client', params);
    
    if (!response || !response.success) {
      throw new Error('Failed to update client: ' + (response?.message || 'Unknown error'));
    }

    return response.data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

// Delete a client
export async function deleteClient(clientId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up deletion parameters
    const params = {
      RecordIds: [clientId]
    };

    const response = await apperClient.deleteRecord('client', params);

    if (!response || !response.success) {
      throw new Error('Failed to delete client: ' + (response?.message || 'Unknown error'));
    }

    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}