import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AddQuoteModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  companies = [], 
  contacts = [], 
  deals = [], 
  addresses = [],
  loading = false 
}) => {
const [formData, setFormData] = useState({
    name: "",
    companyId: "",
    contactId: "",
    dealId: "",
    quoteDate: "",
    status: "Draft",
    deliveryMethod: "",
    expiresOn: "",
    billingAddressId: "",
    shippingAddressId: ""
  });
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: "Draft", label: "Draft" },
    { value: "Sent", label: "Sent" },
    { value: "Accepted", label: "Accepted" },
    { value: "Rejected", label: "Rejected" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Quote name is required";
    }
    
    if (!formData.companyId) {
      newErrors.companyId = "Please select a company";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact";
    }
    
    if (!formData.dealId) {
      newErrors.dealId = "Please select a deal";
    }
    
    if (!formData.quoteDate) {
      newErrors.quoteDate = "Quote date is required";
    }
    
if (!formData.billingAddressId.trim()) {
      newErrors.billingAddressId = "Please enter a billing address";
    }
    
    if (!formData.shippingAddressId) {
      newErrors.shippingAddressId = "Please select a shipping address";
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
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error creating quote:", error);
    }
  };

  const handleClose = () => {
setFormData({
      name: "",
      companyId: "",
      contactId: "",
      dealId: "",
      quoteDate: "",
      status: "Draft",
      deliveryMethod: "",
      expiresOn: "",
      billingAddressId: "",
      shippingAddressId: ""
    });
    setErrors({});
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const formatDateForSubmission = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
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
          className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-0">
            <Card.Header className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <Card.Title className="text-xl font-semibold text-gray-900">
                  Add New Quote
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quote Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quote Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter quote name"
                    className={cn(
                      "w-full",
                      errors.name && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Company, Contact, Deal Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Company Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <select
                      value={formData.companyId}
                      onChange={(e) => handleInputChange("companyId", e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
                        errors.companyId && "border-red-500 focus:ring-red-500"
                      )}
                    >
                      <option value="">Select company</option>
                      {companies.map((company) => (
                        <option key={company.Id} value={company.Id}>
                          {company.companyName || company.Name}
                        </option>
                      ))}
                    </select>
                    {errors.companyId && (
                      <p className="text-sm text-red-600 mt-1">{errors.companyId}</p>
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
                      <option value="">Select contact</option>
                      {contacts.map((contact) => (
                        <option key={contact.Id} value={contact.Id}>
                          {contact.Name}
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
                      Deal *
                    </label>
                    <select
                      value={formData.dealId}
                      onChange={(e) => handleInputChange("dealId", e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
                        errors.dealId && "border-red-500 focus:ring-red-500"
                      )}
                    >
                      <option value="">Select deal</option>
                      {deals.map((deal) => (
                        <option key={deal.Id} value={deal.Id}>
                          {deal.title || deal.Name}
                        </option>
                      ))}
                    </select>
                    {errors.dealId && (
                      <p className="text-sm text-red-600 mt-1">{errors.dealId}</p>
                    )}
                  </div>
                </div>

                {/* Date and Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quote Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quote Date *
                    </label>
                    <Input
                      type="date"
                      value={formatDate(formData.quoteDate)}
                      onChange={(e) => handleInputChange("quoteDate", formatDateForSubmission(e.target.value))}
                      className={cn(
                        "w-full",
                        errors.quoteDate && "border-red-500 focus:ring-red-500"
                      )}
                    />
                    {errors.quoteDate && (
                      <p className="text-sm text-red-600 mt-1">{errors.quoteDate}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expires On */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires On
                    </label>
                    <Input
                      type="date"
                      value={formatDate(formData.expiresOn)}
                      onChange={(e) => handleInputChange("expiresOn", formatDateForSubmission(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Method
                  </label>
                  <Input
                    type="text"
                    value={formData.deliveryMethod}
                    onChange={(e) => handleInputChange("deliveryMethod", e.target.value)}
                    placeholder="Enter delivery method"
                    className="w-full"
                  />
                </div>

                {/* Address Selection Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billing Address */}
<div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Address *
                    </label>
                    <textarea
                      value={formData.billingAddressId}
                      onChange={(e) => handleInputChange("billingAddressId", e.target.value)}
                      placeholder="Enter billing address"
                      rows={3}
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-vertical",
                        errors.billingAddressId && "border-red-500 focus:ring-red-500"
                      )}
                    />
                    {errors.billingAddressId && (
                      <p className="text-sm text-red-600 mt-1">{errors.billingAddressId}</p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Address *
                    </label>
                    <select
                      value={formData.shippingAddressId}
                      onChange={(e) => handleInputChange("shippingAddressId", e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
                        errors.shippingAddressId && "border-red-500 focus:ring-red-500"
                      )}
                    >
                      <option value="">Select shipping address</option>
                      {addresses.map((address) => (
                        <option key={address.Id} value={address.Id}>
                          {address.Name}
                        </option>
                      ))}
                    </select>
                    {errors.shippingAddressId && (
                      <p className="text-sm text-red-600 mt-1">{errors.shippingAddressId}</p>
                    )}
                  </div>
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
                        Add Quote
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

export default AddQuoteModal;