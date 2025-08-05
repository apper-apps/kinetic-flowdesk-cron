import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import DealPipeline from "@/components/organisms/DealPipeline";
import AddDealModal from "@/components/molecules/AddDealModal";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Deals = ({ onMenuClick }) => {
const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
} catch (err) {
      // Enhanced error handling with more specific messaging
      const errorMessage = err?.message?.includes("SDK") 
        ? "System initialization error. Please refresh the page." 
        : "Failed to load deals. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDealClick = (deal) => {
    toast.info(`Opening deal details for ${deal.title}`);
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === dealId);
      if (!deal) return;

      const updatedDeal = { ...deal, stage: newStage };
      await dealService.update(dealId, updatedDeal);
      
      setDeals(prevDeals => 
        prevDeals.map(d => d.Id === dealId ? updatedDeal : d)
      );
      
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error("Failed to update deal stage");
    }
  };

  const headerActions = [
    {
      label: "Pipeline View",
      icon: "BarChart3",
      onClick: () => toast.info("Already in pipeline view"),
      variant: "outline"
    },
{
      label: "Add Deal",
      icon: "Plus",
      onClick: () => setIsAddDealModalOpen(true),
      variant: "primary"
    }
  ];

const handleCreateDeal = async (dealData) => {
    setModalLoading(true);
    try {
      await dealService.create(dealData);
      await loadData(); // Refresh the entire deals list to ensure consistency
      toast.success("Deal created successfully!");
    } catch (err) {
      toast.error("Failed to create deal");
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Deals"
        onMenuClick={onMenuClick}
        actions={headerActions}
      />
      
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DealPipeline
            deals={deals}
            contacts={contacts}
            loading={loading}
            error={error}
            onDealClick={handleDealClick}
            onStageChange={handleStageChange}
            onRetry={loadData}
          />
        </motion.div>
      </main>

      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        onSubmit={handleCreateDeal}
        contacts={contacts}
        loading={modalLoading}
      />
    </div>
  );
};

export default Deals;