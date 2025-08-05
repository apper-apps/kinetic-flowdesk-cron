import companiesData from "@/services/mockData/companies.json";

// Utility function to create delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy of the data to avoid mutations
let companies = [...companiesData];

const companyService = {
  // Get all companies
  async getAll() {
    await delay(300);
    return [...companies];
  },

  // Get company by ID
  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error(`Company with ID ${id} not found`);
    }
    return { ...company };
  },

  // Create new company
  async create(companyData) {
    await delay(400);
    
    // Generate new ID
    const maxId = companies.length > 0 ? Math.max(...companies.map(c => c.Id)) : 0;
    const newCompany = {
      ...companyData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    
    companies.unshift(newCompany);
    return { ...newCompany };
  },

  // Update existing company
  async update(id, companyData) {
    await delay(350);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Company with ID ${id} not found`);
    }
    
    const updatedCompany = {
      ...companies[index],
      ...companyData,
      Id: parseInt(id), // Ensure ID remains unchanged
      modifiedAt: new Date().toISOString()
    };
    
    companies[index] = updatedCompany;
    return { ...updatedCompany };
  },

  // Delete company
  async delete(id) {
    await delay(250);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Company with ID ${id} not found`);
    }
    
    const deletedCompany = companies[index];
    companies.splice(index, 1);
    return { ...deletedCompany };
  },

  // Search companies by name
  async search(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return companies.filter(company => 
      company.companyName.toLowerCase().includes(lowerQuery) ||
      company.industry.toLowerCase().includes(lowerQuery)
    );
  },

  // Get companies by industry
  async getByIndustry(industry) {
    await delay(200);
    return companies.filter(company => 
      company.industry.toLowerCase() === industry.toLowerCase()
    );
  }
};

export { companyService };