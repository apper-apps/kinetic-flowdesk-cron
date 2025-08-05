import { toast } from "react-toastify";

const tableName = 'address';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const addressService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "billToName" } },
          { field: { Name: "street" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "country" } },
          { field: { Name: "pincode" } },
          { field: { Name: "shipToName" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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
      
      return response.data;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Please ensure the SDK script tag is added to index.html");
        toast.error("System initialization error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching addresses:", error?.response?.data?.message);
        toast.error("Failed to load addresses. Please try again.");
      } else {
        console.error("Address service error:", error.message);
        toast.error("Unable to load addresses. Please check your connection.");
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
          { field: { Name: "billToName" } },
          { field: { Name: "street" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "country" } },
          { field: { Name: "pincode" } },
          { field: { Name: "shipToName" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot fetch address details.");
        toast.error("System error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching address with ID ${id}:`, error?.response?.data?.message);
        toast.error(`Failed to load address details.`);
      } else {
        console.error(`Address fetch error for ID ${id}:`, error.message);
        toast.error("Unable to load address. Please try again.");
      }
      return null;
    }
  },

  async create(addressData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: addressData.name || `${addressData.street}, ${addressData.city}`,
          billToName: addressData.billToName,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          pincode: addressData.pincode,
          shipToName: addressData.shipToName
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
          console.error(`Failed to create address ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      return null;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot create address.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error creating address:", error?.response?.data?.message);
        toast.error("Failed to create address. Please check your input and try again.");
      } else {
        console.error("Address creation error:", error.message);
        toast.error("Unable to create address. Please try again.");
      }
      return null;
    }
  },

  async update(id, addressData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: addressData.name || addressData.Name,
          billToName: addressData.billToName,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          pincode: addressData.pincode,
          shipToName: addressData.shipToName
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
          console.error(`Failed to update address ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      return null;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot update address.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error updating address:", error?.response?.data?.message);
        toast.error("Failed to update address. Please check your changes and try again.");
      } else {
        console.error("Address update error:", error.message);
        toast.error("Unable to update address. Please try again.");
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
          console.error(`Failed to delete address ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot delete address.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error deleting address:", error?.response?.data?.message);
        toast.error("Failed to delete address. Please try again.");
      } else {
        console.error("Address deletion error:", error.message);
        toast.error("Unable to delete address. Please try again.");
      }
      return false;
    }
  }
};