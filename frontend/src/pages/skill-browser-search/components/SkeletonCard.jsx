import React from 'react';

const SkeletonCard = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-muted rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="flex space-x-2">
              <div className="h-6 bg-muted rounded-full w-16" />
              <div className="h-6 bg-muted rounded-full w-20" />
              <div className="h-6 bg-muted rounded-full w-14" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-muted rounded w-20" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="p-6 pb-4">
        <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4" />
        <div className="text-center space-y-2">
          <div className="h-5 bg-muted rounded w-2/3 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
        </div>
      </div>
      
      <div className="px-6 pb-4">
        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
        <div className="flex flex-wrap gap-1">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-14" />
        </div>
      </div>
      
      <div className="px-6 pb-6 space-y-2">
        <div className="h-8 bg-muted rounded" />
        <div className="h-8 bg-muted rounded" />
      </div>
    </div>
  );
};

export default SkeletonCard;