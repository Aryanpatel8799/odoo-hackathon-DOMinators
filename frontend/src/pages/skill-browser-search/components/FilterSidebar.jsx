import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const skillCategories = [
    { value: 'technology', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'languages', label: 'Languages' },
    { value: 'arts', label: 'Arts & Crafts' },
    { value: 'fitness', label: 'Fitness & Health' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'music', label: 'Music' },
    { value: 'photography', label: 'Photography' },
    { value: 'writing', label: 'Writing' }
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available Now' },
    { value: 'busy', label: 'Busy' },
    { value: 'away', label: 'Away' }
  ];

  const locationOptions = [
    { value: '5', label: 'Within 5 miles' },
    { value: '10', label: 'Within 10 miles' },
    { value: '25', label: 'Within 25 miles' },
    { value: '50', label: 'Within 50 miles' },
    { value: 'remote', label: 'Remote Only' }
  ];

  const ratingOptions = [
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: '1+ Stars' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      location: '',
      availability: '',
      rating: '',
      verified: false,
      hasReviews: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== '' && value !== false
    ).length;
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>

      {/* Skill Category */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Skill Category</label>
        <Select
          options={skillCategories}
          value={localFilters.category}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="All Categories"
          searchable
        />
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Location</label>
        <Select
          options={locationOptions}
          value={localFilters.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Any Distance"
        />
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Availability</label>
        <Select
          options={availabilityOptions}
          value={localFilters.availability}
          onChange={(value) => handleFilterChange('availability', value)}
          placeholder="Any Status"
        />
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Minimum Rating</label>
        <Select
          options={ratingOptions}
          value={localFilters.rating}
          onChange={(value) => handleFilterChange('rating', value)}
          placeholder="Any Rating"
        />
      </div>

      {/* Additional Filters */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Additional Options</label>
        <div className="space-y-3">
          <Checkbox
            label="Verified Users Only"
            checked={localFilters.verified}
            onChange={(e) => handleFilterChange('verified', e.target.checked)}
          />
          <Checkbox
            label="Users with Reviews"
            checked={localFilters.hasReviews}
            onChange={(e) => handleFilterChange('hasReviews', e.target.checked)}
          />
        </div>
      </div>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          iconName="X"
          iconPosition="left"
          fullWidth
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-card border-r border-border p-6 h-full overflow-y-auto">
        {sidebarContent}
      </div>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;