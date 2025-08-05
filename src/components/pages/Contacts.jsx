import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ContactList from "@/components/organisms/ContactList";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Contacts = ({ onMenuClick }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      toast.error("Failed to load contacts");
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
      onClick: () => toast.info("Add Contact feature coming soon!"),
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
    </div>
  );
};

export default Contacts;