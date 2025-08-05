import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CompanyCard = ({ 
  company, 
  contacts = [], 
  onClick, 
  onEdit, 
  onDelete 
}) => {
  // Get associated contact names
  const getAssociatedContactNames = () => {
    if (!company.associatedContacts || company.associatedContacts.length === 0) {
      return [];
    }
    
    return company.associatedContacts
      .map(contactId => {
        const contact = contacts.find(c => c.Id === contactId);
        return contact ? contact.Name : null;
      })
      .filter(Boolean);
  };

  const associatedContactNames = getAssociatedContactNames();

  // Get company size badge variant
  const getSizeBadgeVariant = (size) => {
    const sizeNumber = parseInt(size.split('-')[0]) || parseInt(size.replace('+', ''));
    if (sizeNumber >= 1000) return "purple";
    if (sizeNumber >= 200) return "blue";
    if (sizeNumber >= 50) return "green";
    return "gray";
  };

  // Get industry icon
  const getIndustryIcon = (industry) => {
    const iconMap = {
      "Technology": "Laptop",
      "Healthcare": "Heart",
      "Financial Services": "DollarSign",
      "Manufacturing": "Factory",
      "Education": "GraduationCap",
      "Retail": "ShoppingBag",
      "Energy": "Zap",
      "Media & Entertainment": "Video",
      "Transportation & Logistics": "Truck",
      "Food & Beverage": "Coffee",
      "Real Estate": "Home",
      "Biotechnology": "Microscope",
      "Sports & Recreation": "Trophy",
      "Consulting": "Users"
    };
    return iconMap[industry] || "Building";
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-200 group">
        <div onClick={onClick} className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-200 transition-colors duration-200">
                <ApperIcon 
                  name={getIndustryIcon(company.industry)} 
                  className="h-6 w-6 text-primary-600" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors duration-200">
                  {company.companyName}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {company.industry}
                </p>
              </div>
            </div>
            
            {/* Company Size Badge */}
            <Badge 
              variant={getSizeBadgeVariant(company.companySize)}
              className="text-xs"
            >
              {company.companySize}
            </Badge>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 mb-4">
            {company.contactEmail && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                <span className="truncate">{company.contactEmail}</span>
              </div>
            )}
            
            {company.phoneNumber && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                <span>{company.phoneNumber}</span>
              </div>
            )}
            
            {company.website && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Globe" className="h-4 w-4 text-gray-400" />
                <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {company.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {company.description}
            </p>
          )}

          {/* Associated Contacts */}
          {associatedContactNames.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Associated Contacts ({associatedContactNames.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {associatedContactNames.slice(0, 3).map((name, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {name}
                  </Badge>
                ))}
                {associatedContactNames.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{associatedContactNames.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {company.Tags && company.Tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {company.Tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {company.Tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{company.Tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {company.createdAt && (
              <>Added {new Date(company.createdAt).toLocaleDateString()}</>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ApperIcon name="Edit" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(company.Id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CompanyCard;