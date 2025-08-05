import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ActivityTimeline from "@/components/organisms/ActivityTimeline";
import AddActivityModal from "@/components/molecules/AddActivityModal";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";

const Activities = ({ onMenuClick }) => {
const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
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
      // Enhanced error handling with more specific messaging
      const errorMessage = err?.message?.includes("SDK") 
        ? "System initialization error. Please refresh the page." 
        : "Failed to load activities. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleAddActivity = async (activityData) => {
    setModalLoading(true);
    try {
      const newActivity = await activityService.create(activityData);
      setActivities(prev => [newActivity, ...prev]);
      toast.success("Activity added successfully!");
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

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
      onClick: () => setIsAddModalOpen(true),
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

      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddActivity}
        contacts={contacts}
        deals={deals}
        loading={modalLoading}
      />
    </div>
  );
};

export default Activities;