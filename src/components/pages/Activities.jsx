import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ActivityTimeline from "@/components/organisms/ActivityTimeline";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Activities = ({ onMenuClick }) => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      
      setActivities(activitiesData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load activities. Please try again.");
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const headerActions = [
    {
      label: "Log Call",
      icon: "Phone",
      onClick: () => toast.info("Log Call feature coming soon!"),
      variant: "outline"
    },
    {
      label: "Add Activity",
      icon: "Plus",
      onClick: () => toast.info("Add Activity feature coming soon!"),
      variant: "primary"
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Activities"
        onMenuClick={onMenuClick}
        actions={headerActions}
      />
      
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ActivityTimeline
            activities={activities}
            contacts={contacts}
            loading={loading}
            error={error}
            onRetry={loadData}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Activities;