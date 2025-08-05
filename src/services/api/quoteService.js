import { toast } from "react-toastify";

const tableName = 'quote';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const quoteService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "companyId" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "quoteDate" } },
          { field: { Name: "status" } },
          { field: { Name: "deliveryMethod" } },
          { field: { Name: "expiresOn" } },
          { field: { Name: "billingAddressId" } },
          { field: { Name: "shippingAddressId" } }
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
      
return response.data.map(quote => ({
        ...quote,
        companyId: quote.companyId?.Id || quote.companyId,
        contactId: quote.contactId?.Id || quote.contactId,
        dealId: quote.dealId?.Id || quote.dealId,
        shippingAddressId: quote.shippingAddressId?.Id || quote.shippingAddressId
      }));
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Please ensure the SDK script tag is added to index.html");
        toast.error("System initialization error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching quotes:", error?.response?.data?.message);
        toast.error("Failed to load quotes. Please try again.");
      } else {
        console.error("Quote service error:", error.message);
        toast.error("Unable to load quotes. Please check your connection.");
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
          { field: { Name: "Tags" } },
          { field: { Name: "companyId" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "quoteDate" } },
          { field: { Name: "status" } },
          { field: { Name: "deliveryMethod" } },
          { field: { Name: "expiresOn" } },
          { field: { Name: "billingAddressId" } },
          { field: { Name: "shippingAddressId" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
return {
        ...response.data,
        companyId: response.data.companyId?.Id || response.data.companyId,
        contactId: response.data.contactId?.Id || response.data.contactId,
        dealId: response.data.dealId?.Id || response.data.dealId,
        shippingAddressId: response.data.shippingAddressId?.Id || response.data.shippingAddressId
      };
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot fetch quote details.");
        toast.error("System error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching quote with ID ${id}:`, error?.response?.data?.message);
        toast.error(`Failed to load quote details.`);
      } else {
        console.error(`Quote fetch error for ID ${id}:`, error.message);
        toast.error("Unable to load quote. Please try again.");
      }
      return null;
    }
  },

  async create(quoteData) {
    try {
      const apperClient = getApperClient();
      const params = {
records: [{
          Name: quoteData.name || `Quote ${Date.now()}`,
          companyId: parseInt(quoteData.companyId),
          contactId: parseInt(quoteData.contactId),
          dealId: parseInt(quoteData.dealId),
          quoteDate: quoteData.quoteDate,
          status: quoteData.status,
          deliveryMethod: quoteData.deliveryMethod,
          expiresOn: quoteData.expiresOn,
          billingAddressId: quoteData.billingAddressId,
          shippingAddressId: parseInt(quoteData.shippingAddressId)
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
          console.error(`Failed to create quote ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newQuote = successfulRecords[0].data;
          return {
...newQuote,
            companyId: newQuote.companyId?.Id || newQuote.companyId,
            contactId: newQuote.contactId?.Id || newQuote.contactId,
            dealId: newQuote.dealId?.Id || newQuote.dealId,
            shippingAddressId: newQuote.shippingAddressId?.Id || newQuote.shippingAddressId
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot create quote.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error creating quote:", error?.response?.data?.message);
        toast.error("Failed to create quote. Please check your input and try again.");
      } else {
        console.error("Quote creation error:", error.message);
        toast.error("Unable to create quote. Please try again.");
      }
      return null;
    }
  },

  async update(id, quoteData) {
    try {
      const apperClient = getApperClient();
const params = {
        records: [{
          Id: id,
          Name: quoteData.name || quoteData.Name,
          companyId: parseInt(quoteData.companyId),
          contactId: parseInt(quoteData.contactId),
          dealId: parseInt(quoteData.dealId),
          quoteDate: quoteData.quoteDate,
          status: quoteData.status,
          deliveryMethod: quoteData.deliveryMethod,
          expiresOn: quoteData.expiresOn,
          billingAddressId: quoteData.billingAddressId,
          shippingAddressId: parseInt(quoteData.shippingAddressId)
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
          console.error(`Failed to update quote ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedQuote = successfulUpdates[0].data;
          return {
...updatedQuote,
            companyId: updatedQuote.companyId?.Id || updatedQuote.companyId,
            contactId: updatedQuote.contactId?.Id || updatedQuote.contactId,
            dealId: updatedQuote.dealId?.Id || updatedQuote.dealId,
            shippingAddressId: updatedQuote.shippingAddressId?.Id || updatedQuote.shippingAddressId
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot update quote.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error updating quote:", error?.response?.data?.message);
        toast.error("Failed to update quote. Please check your changes and try again.");
      } else {
        console.error("Quote update error:", error.message);
        toast.error("Unable to update quote. Please try again.");
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
          console.error(`Failed to delete quote ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot delete quote.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error deleting quote:", error?.response?.data?.message);
        toast.error("Failed to delete quote. Please try again.");
      } else {
        console.error("Quote deletion error:", error.message);
        toast.error("Unable to delete quote. Please try again.");
      }
      return false;
    }
  }
};