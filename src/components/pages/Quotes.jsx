import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import AddQuoteModal from "@/components/molecules/AddQuoteModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { quoteService } from "@/services/api/quoteService";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { addressService } from "@/services/api/addressService";
import { toast } from "react-toastify";

const Quotes = ({ onMenuClick }) => {
  const [quotes, setQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [quotesData, companiesData, contactsData, dealsData, addressesData] = await Promise.all([
        quoteService.getAll(),
        companyService.getAll(),
        contactService.getAll(),
        dealService.getAll(),
        addressService.getAll()
      ]);
      
      setQuotes(quotesData);
      setCompanies(companiesData);
      setContacts(contactsData);
      setDeals(dealsData);
      setAddresses(addressesData);
    } catch (err) {
      const errorMessage = err?.message?.includes("SDK") 
        ? "System initialization error. Please refresh the page." 
        : "Failed to load quotes. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateQuote = async (quoteData) => {
    setModalLoading(true);
    try {
      await quoteService.create(quoteData);
      await loadData();
      toast.success("Quote created successfully!");
    } catch (err) {
      toast.error("Failed to create quote");
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await quoteService.delete(quoteId);
        setQuotes(prevQuotes => prevQuotes.filter(q => q.Id !== quoteId));
        toast.success("Quote deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete quote");
      }
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company?.companyName || company?.Name || 'Unknown Company';
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact?.Name || 'Unknown Contact';
  };

  const getDealName = (dealId) => {
    const deal = deals.find(d => d.Id === dealId);
    return deal?.title || deal?.Name || 'Unknown Deal';
  };

  const getAddressName = (addressId) => {
    const address = addresses.find(a => a.Id === addressId);
    return address?.Name || 'Unknown Address';
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(quote.companyId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getContactName(quote.contactId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = [
    {
      label: "Add Quote",
      icon: "Plus",
      onClick: () => setIsAddQuoteModalOpen(true),
      variant: "primary"
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Quotes"
        onMenuClick={onMenuClick}
        actions={headerActions}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search quotes..."
      />
      
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredQuotes.length === 0 ? (
            <Card className="text-center py-12">
              <ApperIcon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No quotes match your search criteria." : "Get started by creating your first quote."}
              </p>
              <Button onClick={() => setIsAddQuoteModalOpen(true)}>
                <ApperIcon name="Plus" size={16} />
                Add Quote
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredQuotes.map((quote) => (
                  <motion.div
                    key={quote.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {quote.Name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuote(quote.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Building" size={14} />
                          <span>{getCompanyName(quote.companyId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ApperIcon name="User" size={14} />
                          <span>{getContactName(quote.contactId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Target" size={14} />
                          <span>{getDealName(quote.dealId)}</span>
                        </div>
                        {quote.quoteDate && (
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Calendar" size={14} />
                            <span>{new Date(quote.quoteDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {quote.expiresOn && (
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Clock" size={14} />
                            <span>Expires: {new Date(quote.expiresOn).toLocaleDateString()}</span>
                          </div>
                        )}
                        {quote.deliveryMethod && (
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Truck" size={14} />
                            <span>{quote.deliveryMethod}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Billing:</span>
                            <div>{getAddressName(quote.billingAddressId)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Shipping:</span>
                            <div>{getAddressName(quote.shippingAddressId)}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <AddQuoteModal
        isOpen={isAddQuoteModalOpen}
        onClose={() => setIsAddQuoteModalOpen(false)}
        onSubmit={handleCreateQuote}
        companies={companies}
        contacts={contacts}
        deals={deals}
        addresses={addresses}
        loading={modalLoading}
      />
    </div>
  );
};

export default Quotes;