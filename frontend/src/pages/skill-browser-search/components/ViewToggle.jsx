import React from 'react';

import Button from '../../../components/ui/Button';

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        iconName="Grid3X3"
        className="rounded-md"
      >
        <span className="hidden sm:inline ml-2">Grid</span>
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        iconName="List"
        className="rounded-md"
      >
        <span className="hidden sm:inline ml-2">List</span>
      </Button>
    </div>
  );
};

export default ViewToggle;