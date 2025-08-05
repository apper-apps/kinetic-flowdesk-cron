import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import DashboardStats from "@/components/organisms/DashboardStats";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const Dashboard = ({ onMenuClick }) => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
} catch (err) {
      // Enhanced error handling with more specific messaging
      const errorMessage = err?.message?.includes("SDK") 
        ? "System initialization error. Please refresh the page." 
        : "Failed to load dashboard data. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const headerActions = [
    {
      label: "Add Contact",
      icon: "UserPlus",
      onClick: () => toast.info("Add Contact feature coming soon!"),
      variant: "outline"
    },
    {
      label: "Add Deal",
      icon: "Plus",
      onClick: () => toast.info("Add Deal feature coming soon!"),
      variant: "primary"
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Dashboard"
        onMenuClick={onMenuClick}
        actions={headerActions}
      />
      
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardStats 
            contacts={contacts}
            deals={deals}
            activities={activities}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;