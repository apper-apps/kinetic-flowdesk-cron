import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ContactCard from "@/components/molecules/ContactCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ContactList = ({ 
  contacts, 
  loading, 
  error, 
  onContactClick, 
  onRetry,
  searchValue,
  onSearchChange 
}) => {
  const [sortBy, setSortBy] = useState("name");
  const [filterTag, setFilterTag] = useState("");

  const filteredAndSortedContacts = useMemo(() => {
let filtered = contacts.filter(contact => {
      const name = contact.name || contact.Name || "";
      const email = contact.email || "";
      const company = contact.company || "";
      
      const matchesSearch = name.toLowerCase().includes(searchValue.toLowerCase()) ||
                           email.toLowerCase().includes(searchValue.toLowerCase()) ||
                           company.toLowerCase().includes(searchValue.toLowerCase());
      
      const matchesTag = !filterTag || (contact.tags && contact.tags.includes(filterTag));
      
      return matchesSearch && matchesTag;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          const nameA = a.name || a.Name || "";
          const nameB = b.name || b.Name || "";
          return nameA.localeCompare(nameB);
        case "company":
          return (a.company || "").localeCompare(b.company || "");
        case "lastContacted":
          return new Date(b.lastContactedAt || 0) - new Date(a.lastContactedAt || 0);
        default:
          return 0;
      }
    });
  }, [contacts, searchValue, sortBy, filterTag]);

  const allTags = useMemo(() => {
    const tags = new Set();
    contacts.forEach(contact => {
      if (contact.tags) {
        contact.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [contacts]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search contacts..."
          className="flex-1"
        />
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto min-w-[140px]"
          >
            <option value="name">Sort by Name</option>
            <option value="company">Sort by Company</option>
            <option value="lastContacted">Last Contacted</option>
          </select>
          
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="input-field w-auto min-w-[120px]"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(filterTag || searchValue) && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchValue && (
            <Badge variant="primary" className="flex items-center space-x-1">
              <span>Search: {searchValue}</span>
              <button onClick={() => onSearchChange("")}>
                <ApperIcon name="X" className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filterTag && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Tag: {filterTag}</span>
              <button onClick={() => setFilterTag("")}>
                <ApperIcon name="X" className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedContacts.length} contact{filteredAndSortedContacts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Contact Grid */}
      {filteredAndSortedContacts.length === 0 ? (
        <Empty 
          title="No contacts found"
          description={searchValue || filterTag ? "Try adjusting your search or filters" : "Start by adding your first contact"}
          actionLabel="Add Contact"
          onAction={() => {}}
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredAndSortedContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <ContactCard 
                contact={contact} 
                onContactClick={onContactClick}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ContactList;