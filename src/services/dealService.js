// Deal service for handling all deal-related operations with Apper backend

// Fetch all deals
export async function fetchDeals() {
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
        { "Field": { "Name": "Owner" } }
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
          "field": "CreatedOn",
          "direction": "DESC"
        }
      ],
      "pagingInfo": {
        "limit": 50,
        "offset": 0
      }
    };

    const response = await apperClient.fetchRecords('deal', params);

    // Handle empty data
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw error;
  }
}

// Create a new deal
export async function createDeal(dealData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up record to create
    const params = {
      record: dealData
    };

    const response = await apperClient.createRecord('deal', params);

    if (!response || !response.success || !response.data) {
      throw new Error('Failed to create deal');
    }

    return response.data;
  } catch (error) {
    console.error("Error creating deal:", error);
    throw error;
  }
}

// Update an existing deal
export async function updateDeal(dealData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Deal ID must be included in dealData
    if (!dealData.Id) {
      throw new Error('Deal ID is required for updates');
    }

    // Set up record to update
    const params = {
      record: dealData
    };

    const response = await apperClient.updateRecord('deal', params);

    if (!response || !response.success) {
      throw new Error('Failed to update deal');
    }

    return response.data;
  } catch (error) {
    console.error("Error updating deal:", error);
    throw error;
  }
}

// Delete a deal
export async function deleteDeal(dealId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up deletion parameters
    const params = {
      RecordIds: [dealId]
    };

    const response = await apperClient.deleteRecord('deal', params);

    if (!response || !response.success) {
      throw new Error('Failed to delete deal');
    }

    return true;
  } catch (error) {
    console.error("Error deleting deal:", error);
    throw error;
  }
}