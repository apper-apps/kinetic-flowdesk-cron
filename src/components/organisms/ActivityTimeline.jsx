import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import ActivityItem from "@/components/molecules/ActivityItem";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ActivityTimeline = ({ 
  activities, 
  contacts,
  loading, 
  error, 
  onRetry 
}) => {
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const activityTypes = ["all", "call", "email", "meeting", "note", "task"];

  const activitiesWithContacts = useMemo(() => {
    return activities.map(activity => ({
      ...activity,
      contactName: contacts.find(c => c.Id === activity.contactId)?.name || "Unknown Contact"
    }));
  }, [activities, contacts]);

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activitiesWithContacts;
    
    if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [activitiesWithContacts, filterType, sortOrder]);

  const groupedActivities = useMemo(() => {
    const groups = {};
    
    filteredAndSortedActivities.forEach(activity => {
      const date = new Date(activity.date);
      let groupKey;
      
      if (isToday(date)) {
        groupKey = "Today";
      } else if (isYesterday(date)) {
        groupKey = "Yesterday";
      } else if (isThisWeek(date)) {
        groupKey = format(date, "EEEE");
      } else {
        groupKey = format(date, "MMMM dd, yyyy");
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });
    
    return groups;
  }, [filteredAndSortedActivities]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;

  if (activities.length === 0) {
    return (
      <Empty
        title="No activities yet"
        description="Start tracking your interactions with contacts and deals"
        actionLabel="Add Activity"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {activityTypes.map(type => (
            <Button
              key={type}
              variant={filterType === type ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className="capitalize"
            >
              {type === "all" ? "All Activities" : type}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="input-field w-auto"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedActivities.length} activit{filteredAndSortedActivities.length !== 1 ? "ies" : "y"} found
        </p>
      </div>

      {/* Timeline */}
      {Object.keys(groupedActivities).length === 0 ? (
        <Empty
          title="No activities match your filters"
          description="Try adjusting your filter settings"
          actionLabel="Clear Filters"
          onAction={() => setFilterType("all")}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([date, dayActivities], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-900">{date}</h3>
                <Badge variant="secondary">
                  {dayActivities.length} activit{dayActivities.length !== 1 ? "ies" : "y"}
                </Badge>
              </div>
              
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                {dayActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ActivityItem activity={activity} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;