import { toast } from "react-toastify";
import React from "react";

// Table name mapping to database
const tableName = 'company'; // This would need to be updated when database schema is available

// Get ApperClient instance
function getApperClient() {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

const companyService = {
  // Get all companies
  async getAll() {
    try {
      const apperClient = getApperClient();
      
const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "companyName"
            }
          },
          {
            field: {
              Name: "industry"
            }
          },
          {
            field: {
              Name: "website"
            }
          },
          {
            field: {
              Name: "contactEmail"
            }
          },
          {
            field: {
              Name: "phoneNumber"
            }
          },
          {
            field: {
              Name: "companySize"
            }
          },
          {
            field: {
              Name: "address"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(company => ({
        Id: company.Id,
        companyName: company.companyName || company.Name,
        industry: company.industry,
        size: company.size,
        location: company.location,
        website: company.website,
        phone: company.phone,
        email: company.email,
        createdAt: company.createdAt
      }));
    } catch (error) {
      // Enhanced error handling for better debugging
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Please ensure the SDK script tag is added to index.html");
        toast.error("System initialization error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching companies:", error?.response?.data?.message);
        toast.error("Failed to load companies. Please try again.");
      } else {
        console.error("Company service error:", error.message);
        toast.error("Unable to load companies. Please check your connection.");
      }
      return [];
    }
  },

  // Get company by ID
  async getById(id) {
    try {
      const apperClient = getApperClient();
      
const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "companyName"
            }
          },
          {
            field: {
              Name: "industry"
            }
          },
          {
            field: {
              Name: "website"
            }
          },
          {
            field: {
              Name: "contactEmail"
            }
          },
          {
            field: {
              Name: "phoneNumber"
            }
          },
          {
            field: {
              Name: "companySize"
            }
          },
          {
            field: {
              Name: "address"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
{
            field: {
              Name: "Tags"
            }
          }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const company = response.data;
      return {
        Id: company.Id,
        companyName: company.companyName || company.Name,
        industry: company.industry,
        size: company.size,
        location: company.location,
        website: company.website,
        phone: company.phone,
        email: company.email,
        createdAt: company.createdAt
      };
    } catch (error) {
      // Enhanced error handling for single company fetch
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot fetch company details.");
        toast.error("System error. Please refresh the page.");
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching company with ID ${id}:`, error?.response?.data?.message);
        toast.error(`Failed to load company details.`);
      } else {
        console.error(`Company fetch error for ID ${id}:`, error.message);
        toast.error("Unable to load company. Please try again.");
      }
      return null;
    }
  },

  // Create new company
  async create(companyData) {
    try {
      const apperClient = getApperClient();
      
// Only include updateable fields
      const params = {
        records: [
          {
            companyName: companyData.companyName,
            industry: companyData.industry,
            website: companyData.website,
            contactEmail: companyData.contactEmail,
            phoneNumber: companyData.phoneNumber,
            companySize: companyData.companySize,
            address: companyData.address,
            description: companyData.description,
            Tags: companyData.Tags?.join(',') || ''
          }
        ]
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
          console.error(`Failed to create companies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
      // Enhanced error handling for company creation
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot create company.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error creating company:", error?.response?.data?.message);
        toast.error("Failed to create company. Please check your input and try again.");
      } else {
        console.error("Company creation error:", error.message);
        toast.error("Unable to create company. Please try again.");
      }
      return null;
    }
  },

  // Update existing company
  async update(id, companyData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
const params = {
        records: [
          {
            Id: parseInt(id),
            companyName: companyData.companyName,
            industry: companyData.industry,
            website: companyData.website,
            contactEmail: companyData.contactEmail,
            phoneNumber: companyData.phoneNumber,
            companySize: companyData.companySize,
            address: companyData.address,
            description: companyData.description,
            Tags: companyData.Tags?.join(',') || ''
          }
        ]
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
          console.error(`Failed to update companies ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
      // Enhanced error handling for company updates
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot update company.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error updating company:", error?.response?.data?.message);
        toast.error("Failed to update company. Please check your changes and try again.");
      } else {
        console.error("Company update error:", error.message);
        toast.error("Unable to update company. Please try again.");
      }
      return null;
    }
  },

  // Delete company
  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
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
          console.error(`Failed to delete companies ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      // Enhanced error handling for company deletion
      if (error?.message === "Cannot read properties of undefined (reading 'ApperClient')") {
        console.error("Apper SDK not loaded. Cannot delete company.");
        toast.error("System error. Please refresh the page and try again.");
      } else if (error?.response?.data?.message) {
        console.error("Error deleting company:", error?.response?.data?.message);
        toast.error("Failed to delete company. Please try again.");
      } else {
        console.error("Company deletion error:", error.message);
        toast.error("Unable to delete company. Please try again.");
      }
      return false;
    }
  },

  // Search companies by name
  async search(query) {
    try {
      const apperClient = getApperClient();
      
const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "companyName"
            }
          },
          {
            field: {
              Name: "industry"
            }
          },
          {
            field: {
              Name: "website"
            }
          },
          {
            field: {
              Name: "contactEmail"
            }
          }
        ],
        where: [
          {
            FieldName: "companyName",
            Operator: "Contains",
            Values: [query]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(company => ({
        Id: company.Id,
        companyName: company.companyName || company.Name,
        industry: company.industry,
        size: company.size,
        location: company.location
      }));
    } catch (error) {
      console.error("Company search error:", error.message);
      toast.error("Search failed. Please try again.");
      return [];
    }
  },

  // Get companies by industry
  async getByIndustry(industry) {
    try {
      const apperClient = getApperClient();
      
const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "companyName"
            }
          },
          {
            field: {
              Name: "industry"
            }
          },
          {
            field: {
              Name: "website"
            }
          },
          {
            field: {
              Name: "contactEmail"
            }
          }
        ],
        where: [
          {
            FieldName: "industry",
            Operator: "EqualTo",
            Values: [industry]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(company => ({
        Id: company.Id,
        companyName: company.companyName || company.Name,
        industry: company.industry,
        size: company.size,
        location: company.location
      }));
    } catch (error) {
      console.error("Company industry filter error:", error.message);
      toast.error("Filter failed. Please try again.");
      return [];
    }
  }
};

export { companyService };