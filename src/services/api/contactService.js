import { toast } from "react-toastify";

const tableName = 'app_contact';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "notes" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "lastContactedAt" } }
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
      
      return response.data.map(contact => ({
        ...contact,
        tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [],
        name: contact.Name
}));
    } catch (error) {
      // Enhanced error handling for better debugging
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Please ensure the SDK script tag is added to index.html");
        toast.error("System initialization error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching contacts:", error?.response?.data?.message);
        toast.error("Failed to load contacts. Please try again.");
      } else {
        console.error("Contact service error:", error.message);
        toast.error("Unable to load contacts. Please check your connection.");
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "notes" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "lastContactedAt" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        ...response.data,
        tags: response.data.Tags ? response.data.Tags.split(',').map(tag => tag.trim()) : [],
        name: response.data.Name
};
    } catch (error) {
      // Enhanced error handling for single contact fetch
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot fetch contact details.");
        toast.error("System error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
        toast.error(`Failed to load contact details.`);
      } else {
        console.error(`Contact fetch error for ID ${id}:`, error.message);
        toast.error("Unable to load contact. Please try again.");
      }
      return null;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          notes: contactData.notes || "",
          Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ""),
          createdAt: new Date().toISOString(),
          lastContactedAt: new Date().toISOString()
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
          console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newContact = successfulRecords[0].data;
          return {
            ...newContact,
            tags: newContact.Tags ? newContact.Tags.split(',').map(tag => tag.trim()) : [],
            name: newContact.Name
          };
        }
      }
return null;
    } catch (error) {
      // Enhanced error handling for contact creation
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot create contact.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error creating contact:", error?.response?.data?.message);
        toast.error("Failed to create contact. Please check your input and try again.");
      } else {
        console.error("Contact creation error:", error.message);
        toast.error("Unable to create contact. Please try again.");
      }
      return null;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          notes: contactData.notes || "",
          Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ""),
          lastContactedAt: new Date().toISOString()
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
          console.error(`Failed to update contact ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedContact = successfulUpdates[0].data;
          return {
            ...updatedContact,
            tags: updatedContact.Tags ? updatedContact.Tags.split(',').map(tag => tag.trim()) : [],
            name: updatedContact.Name
          };
        }
      }
      return null;
} catch (error) {
      // Enhanced error handling for contact updates
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot update contact.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error updating contact:", error?.response?.data?.message);
        toast.error("Failed to update contact. Please check your changes and try again.");
      } else {
        console.error("Contact update error:", error.message);
        toast.error("Unable to update contact. Please try again.");
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
          console.error(`Failed to delete contact ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
} catch (error) {
      // Enhanced error handling for contact deletion
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot delete contact.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message);
        toast.error("Failed to delete contact. Please try again.");
      } else {
        console.error("Contact deletion error:", error.message);
        toast.error("Unable to delete contact. Please try again.");
      }
      return false;
    }
  }
};