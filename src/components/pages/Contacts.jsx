import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ContactList from "@/components/organisms/ContactList";
import AddContactModal from "@/components/molecules/AddContactModal";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Contacts = ({ onMenuClick }) => {
const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
} catch (err) {
      // Enhanced error handling with more specific messaging
      const errorMessage = err?.message?.includes("SDK") 
        ? "System initialization error. Please refresh the page." 
        : "Failed to load contacts. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

const handleContactClick = (contact) => {
    toast.info(`Opening contact details for ${contact.name}`);
  };

  const handleAddContact = async (contactData) => {
    setIsCreating(true);
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [newContact, ...prev]);
      toast.success(`Contact ${newContact.name} added successfully!`);
    } catch (error) {
      toast.error("Failed to add contact. Please try again.");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };
const headerActions = [
    {
      label: "Import",
      icon: "Upload",
      onClick: () => toast.info("Import contacts feature coming soon!"),
      variant: "outline"
    },
    {
      label: "Add Contact",
      icon: "UserPlus",
      onClick: () => setShowAddModal(true),
      variant: "primary"
    }
  ];

return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Contacts"
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
          <ContactList
            contacts={contacts}
            loading={loading}
            error={error}
            onContactClick={handleContactClick}
            onRetry={loadContacts}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </motion.div>
      </main>

      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddContact}
        loading={isCreating}
      />
    </div>
  );
};

export default Contacts;