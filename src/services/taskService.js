// Task service for handling all task-related operations with Apper backend

// Fetch all tasks
export async function fetchTasks() {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      "Fields": [
        "Id",
        "Name",
        "Tags",
        "Owner",
        "Status",
        "Priority",
        "DueDate",
        "Description"
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

    const response = await apperClient.fetchRecords('task', params);

    // Handle empty data
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

// Create a new task
export async function createTask(taskData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up record to create
    const params = {
      record: {
        Name: taskData.Name,
        Tags: taskData.Tags || '',
        Status: taskData.Status || 'Not Started',
        Priority: taskData.Priority || 'Medium',
        Description: taskData.Description || '',
        DueDate: taskData.DueDate || null
      }
    };

    const response = await apperClient.createRecord('task', params);

    if (!response || !response.success || !response.data) {
      throw new Error('Failed to create task');
    }

    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

// Update an existing task
export async function updateTask(taskData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Task ID must be included in taskData
    if (!taskData.Id) {
      throw new Error('Task ID is required for updates');
    }

    // Set up record to update
    const params = {
      record: {
        Id: taskData.Id,
        ...taskData.Name !== undefined && { Name: taskData.Name },
        ...taskData.Tags !== undefined && { Tags: taskData.Tags },
        ...taskData.Status !== undefined && { Status: taskData.Status },
        ...taskData.Priority !== undefined && { Priority: taskData.Priority },
        ...taskData.Description !== undefined && { Description: taskData.Description },
        ...taskData.DueDate !== undefined && { DueDate: taskData.DueDate }
      }
    };

    const response = await apperClient.updateRecord('task', params);

    if (!response || !response.success) {
      throw new Error('Failed to update task');
    }

    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// Delete a task
export async function deleteTask(taskId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Set up deletion parameters
    const params = {
      RecordIds: [taskId]
    };

    const response = await apperClient.deleteRecord('task', params);

    if (!response || !response.success) {
      throw new Error('Failed to delete task');
    }

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}