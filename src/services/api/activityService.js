import { toast } from "react-toastify";

const tableName = 'app_Activity';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(activity => ({
        ...activity,
        contactId: activity.contactId?.Id || activity.contactId,
        dealId: activity.dealId?.Id || activity.dealId
      }));
} catch (error) {
      // Enhanced error handling for better debugging
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Please ensure the SDK script tag is added to index.html");
        toast.error("System initialization error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message);
        toast.error("Failed to load activities. Please try again.");
      } else {
        console.error("Activity service error:", error.message);
        toast.error("Unable to load activities. Please check your connection.");
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        ...response.data,
        contactId: response.data.contactId?.Id || response.data.contactId,
        dealId: response.data.dealId?.Id || response.data.dealId
      };
    } catch (error) {
      if (error?.response?.data?.message) {
console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
      } else if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot fetch activity details.");
        toast.error("System error. Please refresh the page.");
      } else {
        console.error(`Activity fetch error for ID ${id}:`, error.message);
        toast.error("Unable to load activity. Please try again.");
      }
      return null;
    }
  },
  async create(activityData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: `${activityData.type} - ${new Date().toLocaleDateString()}`,
          type: activityData.type,
          contactId: parseInt(activityData.contactId),
          dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
          description: activityData.description,
          date: activityData.date || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newActivity = successfulRecords[0].data;
          return {
            ...newActivity,
            contactId: newActivity.contactId?.Id || newActivity.contactId,
            dealId: newActivity.dealId?.Id || newActivity.dealId
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
console.error("Error creating activity:", error?.response?.data?.message);
      } else if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot create activity.");
        toast.error("System error. Please refresh the page and try again.");
      } else {
        console.error("Activity creation error:", error.message);
        toast.error("Unable to create activity. Please try again.");
      }
      return null;
    }
  },
  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: activityData.Name || `${activityData.type} - ${new Date().toLocaleDateString()}`,
          type: activityData.type,
          contactId: parseInt(activityData.contactId),
          dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
          description: activityData.description,
          date: activityData.date
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update activity ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedActivity = successfulUpdates[0].data;
          return {
            ...updatedActivity,
            contactId: updatedActivity.contactId?.Id || updatedActivity.contactId,
            dealId: updatedActivity.dealId?.Id || updatedActivity.dealId
          };
        }
      }
      return null;
} catch (error) {
      // Enhanced error handling for activity updates
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot update activity.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error updating activity:", error?.response?.data?.message);
        toast.error("Failed to update activity. Please check your changes and try again.");
      } else {
        console.error("Activity update error:", error.message);
        toast.error("Unable to update activity. Please try again.");
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activity ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
} catch (error) {
      // Enhanced error handling for activity deletion
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot delete activity.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
        toast.error("Failed to delete activity. Please try again.");
      } else {
        console.error("Activity deletion error:", error.message);
        toast.error("Unable to delete activity. Please try again.");
      }
      return false;
    }
  }
};