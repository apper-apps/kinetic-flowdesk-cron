import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AddDealModal = ({ isOpen, onClose, onSubmit, contacts = [], loading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "lead",
    contactId: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});

const stages = [
    { value: "Lead", label: "Lead" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal", label: "Proposal" },
    { value: "Won", label: "Won" },
    { value: "Lost", label: "Lost" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }
    
    if (!formData.value.trim()) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Please enter a valid positive number";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId)
      };
      await onSubmit(dealData);
      handleClose();
    } catch (error) {
      console.error("Error creating deal:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      value: "",
      stage: "lead",
      contactId: "",
      notes: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-0">
            <Card.Header className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <Card.Title className="text-xl font-semibold text-gray-900">
                  Add New Deal
                </Card.Title>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </Card.Header>
            
            <Card.Content className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter deal title"
                    className={cn(
                      "w-full",
                      errors.title && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Value Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Value *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleInputChange("value", e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={cn(
                        "w-full pl-8",
                        errors.value && "border-red-500 focus:ring-red-500"
                      )}
                    />
                  </div>
                  {errors.value && (
                    <p className="text-sm text-red-600 mt-1">{errors.value}</p>
                  )}
                </div>

                {/* Stage Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => handleInputChange("stage", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    {stages.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact *
                  </label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => handleInputChange("contactId", e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
                      errors.contactId && "border-red-500 focus:ring-red-500"
                    )}
                  >
                    <option value="">Select a contact</option>
                    {contacts.map((contact) => (
                      <option key={contact.Id} value={contact.Id}>
                        {contact.name} - {contact.company}
                      </option>
                    ))}
                  </select>
                  {errors.contactId && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactId}</p>
                  )}
                </div>

                {/* Notes Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add any additional notes about this deal..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} />
                        Add Deal
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddDealModal;