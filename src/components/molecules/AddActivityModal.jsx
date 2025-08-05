import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AddActivityModal = ({ isOpen, onClose, onSubmit, contacts = [], deals = [], loading = false }) => {
  const [formData, setFormData] = useState({
    type: "call",
    contactId: "",
    dealId: "",
    description: "",
    date: new Date().toISOString().slice(0, 16)
  });
  const [errors, setErrors] = useState({});

  const activityTypes = [
    { value: "call", label: "Call", icon: "Phone" },
    { value: "email", label: "Email", icon: "Mail" },
    { value: "meeting", label: "Meeting", icon: "Users" },
    { value: "note", label: "Note", icon: "FileText" },
    { value: "task", label: "Task", icon: "CheckCircle" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) {
      newErrors.type = "Activity type is required";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
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
      const activityData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        date: new Date(formData.date).toISOString()
      };
      await onSubmit(activityData);
      handleClose();
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "call",
      contactId: "",
      dealId: "",
      description: "",
      date: new Date().toISOString().slice(0, 16)
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
                  Add New Activity
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
                {/* Activity Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activityTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange("type", type.value)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-md border transition-all duration-200",
                          formData.type === type.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        )}
                      >
                        <ApperIcon name={type.icon} size={16} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="text-sm text-red-600 mt-1">{errors.type}</p>
                  )}
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

                {/* Deal Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Deal
                  </label>
                  <select
                    value={formData.dealId}
                    onChange={(e) => handleInputChange("dealId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">No deal associated</option>
                    {deals.map((deal) => (
                      <option key={deal.Id} value={deal.Id}>
                        {deal.title} - ${deal.value?.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the activity details..."
                    rows={4}
                    className={cn(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none",
                      errors.description && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={cn(
                      "w-full",
                      errors.date && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                  )}
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
                        Add Activity
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

export default AddActivityModal;