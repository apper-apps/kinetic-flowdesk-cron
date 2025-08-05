import { toast } from "react-toastify";

const tableName = 'deal';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contactId" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedCloseDate" } },
          { field: { Name: "notes" } },
          { field: { Name: "createdAt" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
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
      
      return response.data.map(deal => ({
        ...deal,
        contactId: deal.contactId?.Id || deal.contactId
}));
    } catch (error) {
      // Enhanced error handling for better debugging
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Please ensure the SDK script tag is added to index.html");
        toast.error("System initialization error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
        toast.error("Failed to load deals. Please try again.");
      } else {
        console.error("Deal service error:", error.message);
        toast.error("Unable to load deals. Please check your connection.");
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
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contactId" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedCloseDate" } },
          { field: { Name: "notes" } },
          { field: { Name: "createdAt" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        ...response.data,
        contactId: response.data.contactId?.Id || response.data.contactId
};
    } catch (error) {
      // Enhanced error handling for single deal fetch
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot fetch deal details.");
        toast.error("System error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
        toast.error(`Failed to load deal details.`);
      } else {
        console.error(`Deal fetch error for ID ${id}:`, error.message);
        toast.error("Unable to load deal. Please try again.");
      }
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: dealData.title,
          title: dealData.title,
          value: parseFloat(dealData.value),
          stage: dealData.stage,
          contactId: parseInt(dealData.contactId),
          probability: dealData.probability || 50,
          expectedCloseDate: dealData.expectedCloseDate || null,
          notes: dealData.notes || "",
          createdAt: new Date().toISOString()
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
          console.error(`Failed to create deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newDeal = successfulRecords[0].data;
          return {
            ...newDeal,
            contactId: newDeal.contactId?.Id || newDeal.contactId
          };
        }
      }
      return null;
} catch (error) {
      // Enhanced error handling for deal creation
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot create deal.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
        toast.error("Failed to create deal. Please check your input and try again.");
      } else {
        console.error("Deal creation error:", error.message);
        toast.error("Unable to create deal. Please try again.");
      }
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: dealData.title || dealData.Name,
          title: dealData.title,
          value: parseFloat(dealData.value),
          stage: dealData.stage,
          contactId: parseInt(dealData.contactId),
          probability: dealData.probability || 50,
          expectedCloseDate: dealData.expectedCloseDate || null,
          notes: dealData.notes || ""
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
          console.error(`Failed to update deal ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedDeal = successfulUpdates[0].data;
          return {
            ...updatedDeal,
            contactId: updatedDeal.contactId?.Id || updatedDeal.contactId
          };
        }
      }
      return null;
} catch (error) {
      // Enhanced error handling for deal updates
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot update deal.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
        toast.error("Failed to update deal. Please check your changes and try again.");
      } else {
        console.error("Deal update error:", error.message);
        toast.error("Unable to update deal. Please try again.");
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
          console.error(`Failed to delete deal ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
} catch (error) {
      // Enhanced error handling for deal deletion
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot delete deal.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
        toast.error("Failed to delete deal. Please try again.");
      } else {
        console.error("Deal deletion error:", error.message);
        toast.error("Unable to delete deal. Please try again.");
      }
      return false;
    }
  }
};