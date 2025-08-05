import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DealCard from "@/components/molecules/DealCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const DealPipeline = ({ 
  deals, 
  contacts,
  loading, 
  error, 
  onDealClick, 
  onStageChange,
  onRetry 
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = ["Lead", "Qualified", "Proposal", "Won", "Lost"];
  
  const stageColors = {
    "Lead": "bg-blue-50 border-blue-200",
    "Qualified": "bg-yellow-50 border-yellow-200", 
    "Proposal": "bg-purple-50 border-purple-200",
    "Won": "bg-green-50 border-green-200",
    "Lost": "bg-red-50 border-red-200"
  };

  const dealsByStage = useMemo(() => {
const dealsWithContacts = deals.map(deal => ({
      ...deal,
      contactName: contacts.find(c => c.Id === deal.contactId)?.name || contacts.find(c => c.Id === deal.contactId)?.Name || "Unknown Contact"
    }));

    return stages.reduce((acc, stage) => {
      acc[stage] = dealsWithContacts.filter(deal => deal.stage === stage);
      return acc;
    }, {});
  }, [deals, contacts]);

  const stageStats = useMemo(() => {
    return stages.reduce((acc, stage) => {
      const stageDeals = dealsByStage[stage] || [];
      acc[stage] = {
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
      };
      return acc;
    }, {});
  }, [dealsByStage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleDrop = (stage) => {
    if (draggedDeal && draggedDeal.stage !== stage) {
      onStageChange(draggedDeal.Id, stage);
    }
    setDraggedDeal(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;

  if (deals.length === 0) {
    return (
      <Empty
        title="No deals yet"
        description="Start tracking your sales pipeline by adding your first deal"
        actionLabel="Add Deal"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stages.map(stage => (
          <div key={stage} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stageStats[stage].count}
              </div>
              <div className="text-sm text-gray-600 mb-2">{stage}</div>
              <div className="text-lg font-semibold text-primary-600">
                {formatCurrency(stageStats[stage].value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px]">
          {stages.map(stage => (
            <div
              key={stage}
              className={`${stageColors[stage]} rounded-lg p-4 border-2 border-dashed transition-colors duration-200`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{stage}</h3>
                <Badge variant={stage.toLowerCase()}>
                  {dealsByStage[stage]?.length || 0}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {dealsByStage[stage]?.map(deal => (
                    <motion.div
                      key={deal.Id}
                      draggable
                      onDragStart={() => handleDragStart(deal)}
                      onDragEnd={handleDragEnd}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileDrag={{ scale: 1.05, rotate: 2 }}
                      className="cursor-move"
                    >
                      <DealCard
                        deal={deal}
                        onDealClick={onDealClick}
                        onStageChange={onStageChange}
                        isDragging={draggedDeal?.Id === deal.Id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {(!dealsByStage[stage] || dealsByStage[stage].length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Plus" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Drop deals here</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealPipeline;