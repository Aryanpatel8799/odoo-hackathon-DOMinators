import React from 'react';

const UserCardSkeleton = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
        <div className="flex items-center space-x-4">
          {/* Avatar skeleton */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 bg-muted rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-muted rounded-full border-2 border-card" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-muted rounded mb-2 w-32" />
            <div className="space-y-1 mb-3">
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
            <div className="flex flex-wrap gap-1">
              <div className="h-6 bg-muted rounded-full w-16" />
              <div className="h-6 bg-muted rounded-full w-20" />
              <div className="h-6 bg-muted rounded-full w-14" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-8 bg-muted rounded w-20" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="relative p-6 pb-4">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="w-full h-full bg-muted rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-muted rounded-full border-2 border-card" />
        </div>
        
        <div className="text-center">
          <div className="h-5 bg-muted rounded mb-2 w-24 mx-auto" />
          <div className="h-3 bg-muted rounded mb-3 w-20 mx-auto" />
          <div className="flex justify-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-muted rounded" />
            ))}
          </div>
          <div className="h-3 bg-muted rounded w-16 mx-auto" />
        </div>
      </div>

      {/* Skills skeleton */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-muted rounded w-12" />
          <div className="h-3 bg-muted rounded w-8" />
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="h-3 bg-muted rounded w-16 mb-2" />
            <div className="flex flex-wrap gap-1">
              <div className="h-6 bg-muted rounded-full w-16" />
              <div className="h-6 bg-muted rounded-full w-20" />
            </div>
          </div>
          
          <div>
            <div className="h-3 bg-muted rounded w-20 mb-2" />
            <div className="flex flex-wrap gap-1">
              <div className="h-6 bg-muted rounded-full w-14" />
              <div className="h-6 bg-muted rounded-full w-18" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="px-6 pb-6 space-y-2">
        <div className="h-8 bg-muted rounded" />
        <div className="h-8 bg-muted rounded" />
      </div>
    </div>
  );
};

export default UserCardSkeleton; 