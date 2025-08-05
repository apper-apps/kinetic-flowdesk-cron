import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import AddCompanyModal from "@/components/molecules/AddCompanyModal";
import CompanyCard from "@/components/molecules/CompanyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Companies = ({ onMenuClick }) => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load data on component mount
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [companiesData, contactsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll()
      ]);
      
      setCompanies(companiesData);
      setContacts(contactsData);
} catch (err) {
      // Enhanced error handling with more specific messaging
      const errorMessage = err?.message?.includes("SDK") 
        ? "System initialization error. Please refresh the page." 
        : "Failed to load companies. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort companies
  const filteredAndSortedCompanies = companies
    .filter(company => 
      company.companyName.toLowerCase().includes(searchValue.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.companyName.localeCompare(b.companyName);
        case "industry":
          return a.industry.localeCompare(b.industry);
        case "size":
          const sizeOrder = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001+"];
          return sizeOrder.indexOf(a.companySize) - sizeOrder.indexOf(b.companySize);
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  // Handle company creation
  const handleAddCompany = async (companyData) => {
    setIsCreating(true);
    try {
      const newCompany = await companyService.create(companyData);
      setCompanies(prev => [newCompany, ...prev]);
      toast.success(`Company ${newCompany.companyName} added successfully!`);
      setShowAddModal(false);
      setEditingCompany(null);
    } catch (error) {
      toast.error("Failed to add company. Please try again.");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Handle company editing
  const handleEditCompany = async (companyData) => {
    if (!editingCompany) return;
    
    setIsCreating(true);
    try {
      const updatedCompany = await companyService.update(editingCompany.Id, companyData);
      setCompanies(prev => 
        prev.map(c => c.Id === editingCompany.Id ? updatedCompany : c)
      );
      toast.success(`Company ${updatedCompany.companyName} updated successfully!`);
      setShowAddModal(false);
      setEditingCompany(null);
    } catch (error) {
      toast.error("Failed to update company. Please try again.");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Handle company deletion
  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      await companyService.delete(companyId);
      setCompanies(prev => prev.filter(c => c.Id !== companyId));
      toast.success("Company deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete company. Please try again.");
    }
  };

  // Handle company click
const handleCompanyClick = (company) => {
    // Create a detailed view showing company information
    const companyDetails = `
Company: ${company.companyName}
Industry: ${company.industry}
Size: ${company.companySize} employees
Website: ${company.website || 'Not provided'}
Email: ${company.contactEmail}
Phone: ${company.phoneNumber || 'Not provided'}
Address: ${company.address || 'Not provided'}
Description: ${company.description || 'No description available'}
    `.trim();
    
    toast.info(companyDetails, {
      autoClose: 8000,
      style: { whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '12px' }
    });
  };

  // Handle edit click
  const handleEditClick = (company) => {
    setEditingCompany(company);
    setShowAddModal(true);
  };

  // Header actions
  const headerActions = [
    {
      label: "Sort",
      icon: "ArrowUpDown",
      onClick: () => {
        const sortOptions = ["name", "industry", "size", "recent"];
        const currentIndex = sortOptions.indexOf(sortBy);
        const nextIndex = (currentIndex + 1) % sortOptions.length;
        setSortBy(sortOptions[nextIndex]);
        toast.info(`Sorted by ${sortOptions[nextIndex]}`);
      },
      variant: "outline"
    },
    {
      label: "Add Company",
      icon: "Plus",
      onClick: () => {
        setEditingCompany(null);
        setShowAddModal(true);
      },
      variant: "primary"
    }
  ];

  // Render loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <Header 
          title="Companies"
          onMenuClick={onMenuClick}
          showSearch={true}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          actions={headerActions}
        />
        <main className="p-6">
          <Loading />
        </main>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex-1 overflow-auto">
        <Header 
          title="Companies"
          onMenuClick={onMenuClick}
          showSearch={true}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          actions={headerActions}
        />
        <main className="p-6">
          <Error 
            message={error}
            onRetry={loadData}
            title="Failed to load companies"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Companies"
        onMenuClick={onMenuClick}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        actions={headerActions}
      />
      
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sort info */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredAndSortedCompanies.length} companies 
              {searchValue && ` matching "${searchValue}"`}
              {sortBy !== "name" && ` sorted by ${sortBy}`}
            </p>
            <div className="text-sm text-gray-500">
              Total: {companies.length} companies
            </div>
          </div>

          {/* Companies list */}
          {filteredAndSortedCompanies.length === 0 ? (
            <Empty
              title={searchValue ? "No companies found" : "No companies yet"}
              description={searchValue ? `No companies match "${searchValue}"` : "Get started by adding your first company"}
              actionLabel="Add Company"
              onAction={() => {
                setEditingCompany(null);
                setShowAddModal(true);
              }}
              icon="Building"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCompanies.map((company, index) => (
                <motion.div
                  key={company.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CompanyCard
                    company={company}
                    contacts={contacts}
                    onClick={() => handleCompanyClick(company)}
                    onEdit={() => handleEditClick(company)}
                    onDelete={() => handleDeleteCompany(company.Id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Add/Edit Company Modal */}
      <AddCompanyModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCompany(null);
        }}
        onSubmit={editingCompany ? handleEditCompany : handleAddCompany}
        company={editingCompany}
        contacts={contacts}
        loading={isCreating}
      />
    </div>
  );
};

export default Companies;