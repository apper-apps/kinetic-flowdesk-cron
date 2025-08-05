import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      task: "CheckCircle"
    };
    return icons[type] || "Circle";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-500 bg-blue-50",
      email: "text-green-500 bg-green-50", 
      meeting: "text-purple-500 bg-purple-50",
      note: "text-gray-500 bg-gray-50",
      task: "text-orange-500 bg-orange-50"
    };
    return colors[type] || "text-gray-500 bg-gray-50";
  };

  return (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-200">
      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
        <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 capitalize">
            {activity.type}
          </p>
          <time className="text-xs text-gray-500">
            {format(new Date(activity.date), "MMM dd, yyyy 'at' h:mm a")}
          </time>
        </div>
        
        <p className="mt-1 text-sm text-gray-600">
          {activity.description}
        </p>
        
        {activity.contactName && (
          <p className="mt-1 text-xs text-gray-500">
            Contact: {activity.contactName}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;