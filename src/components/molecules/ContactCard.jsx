import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ContactCard = ({ contact, onContactClick }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "from-purple-400 to-pink-400",
      "from-blue-400 to-cyan-400",
      "from-green-400 to-emerald-400",
      "from-yellow-400 to-orange-400",
      "from-red-400 to-pink-400",
      "from-indigo-400 to-purple-400"
    ];
    const hash = name.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
      onClick={() => onContactClick(contact)}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(contact.name)} flex items-center justify-center text-white font-semibold text-sm shadow-md`}>
            {getInitials(contact.name)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {contact.name}
                </h4>
                {contact.company && (
                  <p className="text-sm text-gray-600 truncate">
                    {contact.company}
                  </p>
                )}
              </div>
              
              {contact.tags && contact.tags.length > 0 && (
                <Badge variant="primary" className="ml-2 shrink-0">
                  {contact.tags[0]}
                  {contact.tags.length > 1 && ` +${contact.tags.length - 1}`}
                </Badge>
              )}
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                <span className="truncate">{contact.email}</span>
              </div>
              
              {contact.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                  <span>{contact.phone}</span>
                </div>
              )}
            </div>
            
            {contact.lastContactedAt && (
              <div className="mt-2 text-xs text-gray-500">
                Last contacted: {format(new Date(contact.lastContactedAt), "MMM dd, yyyy")}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContactCard;