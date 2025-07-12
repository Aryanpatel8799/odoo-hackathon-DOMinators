import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SwapFilters = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'deadline', label: 'By Deadline' },
    { value: 'skill', label: 'By Skill' }
  ];

  const skillCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'languages', label: 'Languages' },
    { value: 'music', label: 'Music' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'business', label: 'Business' }
  ];

  const directionOptions = [
    { value: 'all', label: 'All Requests' },
    { value: 'incoming', label: 'Incoming' },
    { value: 'outgoing', label: 'Outgoing' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...activeFilters, [key]: value });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: 'all',
      sort: 'newest',
      category: 'all',
      direction: 'all'
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== 'all' && value !== 'newest');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <h3 className="font-medium text-foreground">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide' : 'Show'}
        </Button>
      </div>

      {/* Filter Controls */}
      <div className={`space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4 ${!isExpanded ? 'hidden lg:flex' : ''}`}>
        {/* Status Filter */}
        <div className="flex-1 lg:max-w-48">
          <Select
            label="Status"
            options={statusOptions}
            value={activeFilters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
        </div>

        {/* Direction Filter */}
        <div className="flex-1 lg:max-w-48">
          <Select
            label="Direction"
            options={directionOptions}
            value={activeFilters.direction}
            onChange={(value) => handleFilterChange('direction', value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex-1 lg:max-w-48">
          <Select
            label="Category"
            options={skillCategories}
            value={activeFilters.category}
            onChange={(value) => handleFilterChange('category', value)}
            searchable
          />
        </div>

        {/* Sort Filter */}
        <div className="flex-1 lg:max-w-48">
          <Select
            label="Sort by"
            options={sortOptions}
            value={activeFilters.sort}
            onChange={(value) => handleFilterChange('sort', value)}
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            iconPosition="left"
            iconSize={16}
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className="mt-6 lg:mt-0"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {activeFilters.status !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              Status: {statusOptions.find(opt => opt.value === activeFilters.status)?.label}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="ml-2 hover:text-primary/70"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {activeFilters.direction !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
              Direction: {directionOptions.find(opt => opt.value === activeFilters.direction)?.label}
              <button
                onClick={() => handleFilterChange('direction', 'all')}
                className="ml-2 hover:text-secondary/70"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {activeFilters.category !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
              Category: {skillCategories.find(opt => opt.value === activeFilters.category)?.label}
              <button
                onClick={() => handleFilterChange('category', 'all')}
                className="ml-2 hover:text-accent/70"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SwapFilters;