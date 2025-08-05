import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  const SkeletonCard = ({ delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
    >
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </motion.div>
  );

  const SkeletonStats = ({ delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
    >
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
            <div className="h-8 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonStats delay={0} />
        <SkeletonStats delay={0.1} />
        <SkeletonStats delay={0.2} />
        <SkeletonStats delay={0.3} />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SkeletonCard delay={0.4} />
        <SkeletonCard delay={0.5} />
        <SkeletonCard delay={0.6} />
        <SkeletonCard delay={0.7} />
        <SkeletonCard delay={0.8} />
        <SkeletonCard delay={0.9} />
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-primary-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full"
          />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;