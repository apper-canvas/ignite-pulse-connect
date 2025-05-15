// Contact service for handling all contact-related operations with Apper backend

// Fetch all contacts
export async function fetchContacts() {
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
        { "Field": { "Name": "position" } },
        { "Field": { "Name": "leadSource" } },
        { "Field": { "Name": "lastContactDate" } }
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
          "field": "lastContactDate",
          "direction": "DESC"
        }
      ],
      "pagingInfo": {
        "limit": 50,
        "offset": 0
      }
    };

    const response = await apperClient.fetchRecords('contact', params);

    // Handle empty data
    if (!response || !response.data || response.data.length === 0) {
      console.log("No contacts found or empty response");
      return []; 
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}

// Fetch a single contact by ID
export async function getContactById(contactId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('contact', contactId);

    if (!response || !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching contact with ID ${contactId}:`, error);
    throw error;
  }
}

// Create a new contact
export async function createContact(contactData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up record to create
    const params = {
      record: contactData
    };

    try {
      const response = await apperClient.createRecord('contact', params);

      if (!response || !response.success || !response.data) {
        console.error('Failed to create contact:', response);
        throw new Error('Failed to create contact: ' + (response?.message || 'Unknown error'));
      }
      
      return response.data;
    } catch (apiError) {
      throw new Error(`API Error: ${apiError.message || 'Unknown error creating contact'}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
}

// Update an existing contact
export async function updateContact(contactData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Contact ID must be included in contactData
    if (!contactData.Id) {
      throw new Error('Contact ID is required for updates');
    }

    // Set up record to update
    const params = {
      record: contactData
    };

    const response = await apperClient.updateRecord('contact', params);
    
    if (!response || !response.success) {
      throw new Error('Failed to update contact: ' + (response?.message || 'Unknown error'));
    }

    return response.data;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
}

// Delete a contact
export async function deleteContact(contactId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up deletion parameters
    const params = {
      RecordIds: [contactId]
    };

    const response = await apperClient.deleteRecord('contact', params);

    if (!response || !response.success) {
      throw new Error('Failed to delete contact: ' + (response?.message || 'Unknown error'));
    }

    return true;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}