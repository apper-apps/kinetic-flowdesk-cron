import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const AddCompanyModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  company = null, 
  contacts = [], 
  loading = false 
}) => {
const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    contactEmail: "",
    phoneNumber: "",
    companySize: "",
    address: "",
    description: "",
    Tags: []
  });

  const [errors, setErrors] = useState({});

  // Industry options
  const industryOptions = [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Manufacturing",
    "Education",
    "Retail",
    "Energy",
    "Media & Entertainment",
    "Transportation & Logistics",
    "Food & Beverage",
    "Real Estate",
    "Biotechnology",
    "Sports & Recreation",
    "Consulting",
    "Other"
  ];

  // Company size options
  const companySizeOptions = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001+"
  ];

  // Initialize form data when company prop changes
  useEffect(() => {
    if (company) {
setFormData({
        companyName: company.companyName || "",
        industry: company.industry || "",
        website: company.website || "",
        contactEmail: company.contactEmail || "",
        phoneNumber: company.phoneNumber || "",
        companySize: company.companySize || "",
        address: company.address || "",
        description: company.description || "",
        Tags: typeof company.Tags === 'string' ? company.Tags.split(',').filter(t => t.trim()) : (company.Tags || [])
      });
    } else {
      setFormData({
        companyName: "",
        industry: "",
        website: "",
        contactEmail: "",
        phoneNumber: "",
        companySize: "",
        address: "",
        description: "",
        associatedContacts: [],
        Tags: []
      });
    }
    setErrors({});
  }, [company]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle contact selection
  const handleContactToggle = (contactId) => {
    setFormData(prev => ({
      ...prev,
      associatedContacts: prev.associatedContacts.includes(contactId)
        ? prev.associatedContacts.filter(id => id !== contactId)
        : [...prev.associatedContacts, contactId]
    }));
  };

  // Validate form
const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL (must start with http:// or https://)";
    }

    if (!formData.companySize) {
      newErrors.companySize = "Company size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await onSubmit(formData);
      // onClose will be called by parent component on success
    } catch (error) {
      // Error is already handled by parent component
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        companyName: "",
        industry: "",
        website: "",
        contactEmail: "",
        phoneNumber: "",
        companySize: "",
        address: "",
        description: "",
        associatedContacts: [],
        Tags: []
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {company ? "Edit Company" : "Add New Company"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {company ? "Update company information" : "Enter company details"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Enter company name"
                    className={errors.companyName ? "border-red-300 focus:ring-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.industry ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select industry</option>
                    {industryOptions.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                    className={errors.website ? "border-red-300 focus:ring-red-500" : ""}
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                  )}
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="contact@company.com"
                    className={errors.contactEmail ? "border-red-300 focus:ring-red-500" : ""}
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+1-555-0123"
                  />
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size *
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => handleInputChange("companySize", e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.companySize ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select company size</option>
                    {companySizeOptions.map(size => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                  {errors.companySize && (
                    <p className="mt-1 text-sm text-red-600">{errors.companySize}</p>
                  )}
                </div>

                {/* Address */}
<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter company address (street, city, state, zip)"
                    rows={3}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the company and its business"
                    rows={4}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <Input
                    type="text"
                    value={Array.isArray(formData.Tags) ? formData.Tags.join(', ') : formData.Tags}
                    onChange={(e) => {
                      const tagsString = e.target.value;
                      const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
                      handleInputChange("Tags", tagsArray);
                    }}
                    placeholder="Enter tags separated by commas (e.g., client, startup, tech)"
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple tags with commas
                  </p>
                </div>

                {/* Associated Contacts */}
                {contacts.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Associated Contacts
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
                      {contacts.slice(0, 10).map(contact => (
                        <label key={contact.Id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            checked={formData.associatedContacts.includes(contact.Id)}
                            onChange={() => handleContactToggle(contact.Id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">
                            {contact.Name} {contact.email && `(${contact.email})`}
                          </span>
                        </label>
                      ))}
                      {contacts.length > 10 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Showing first 10 contacts
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{company ? "Update Company" : "Add Company"}</span>
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddCompanyModal;