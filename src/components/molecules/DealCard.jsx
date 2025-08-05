import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const DealCard = ({ deal, onDealClick, onStageChange, isDragging }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage) => {
    const colors = {
      "Lead": "lead",
      "Qualified": "qualified",
      "Proposal": "proposal",
      "Won": "won",
      "Lost": "lost"
    };
    return colors[stage] || "default";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`cursor-pointer ${isDragging ? "rotate-2 scale-105" : ""}`}
      onClick={() => onDealClick(deal)}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1">
              {deal.title}
            </h4>
            <Badge variant={getStageColor(deal.stage)} className="ml-2 shrink-0">
              {deal.stage}
            </Badge>
          </div>
          
          <div className="text-2xl font-bold text-primary-600 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            {formatCurrency(deal.value)}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ApperIcon name="User" className="h-4 w-4" />
              <span className="truncate">{deal.contactName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <ApperIcon name="Calendar" className="h-4 w-4" />
              <span>{format(new Date(deal.expectedCloseDate), "MMM dd, yyyy")}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <ApperIcon name="Target" className="h-4 w-4" />
              <span>{deal.probability}% probability</span>
            </div>
          </div>
          
          {deal.notes && (
            <p className="text-sm text-gray-500 line-clamp-2 bg-gray-50 p-2 rounded">
              {deal.notes}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;