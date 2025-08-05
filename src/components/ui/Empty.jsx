import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} className="h-10 w-10 text-primary-500" />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-gray-600 mb-8"
        >
          {description}
        </motion.p>
        
        {onAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Button
              onClick={onAction}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>{actionLabel}</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;