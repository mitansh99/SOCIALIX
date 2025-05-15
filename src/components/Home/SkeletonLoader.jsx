import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-lg transition-shadow duration-200 animate-pulse">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Profile Image */}
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          <div>
            {/* Name */}
            <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
            {/* Username and Time */}
            <div className="h-3 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between">
          <div className="flex items-center space-x-1">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
