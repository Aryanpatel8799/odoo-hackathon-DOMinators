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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <Icon name="Sliders" size={20} className="text-primary" /> Filters
        </h3>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
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
      <hr className="border-border" />

      {/* Skill Category */}
      <div className="space-y-2">
        <label className="text-base font-semibold text-foreground flex items-center gap-2">
          <Icon name="Layers" size={16} className="text-muted-foreground" /> Skill Category
        </label>
        <Select
          options={skillCategories}
          value={localFilters.category}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="All Categories"
          searchable
          className="focus:ring-2 focus:ring-primary rounded-lg hover:bg-blue-50 transition-colors"
        />
      </div>
      <hr className="border-border" />

      {/* Location */}
      <div className="space-y-2">
        <label className="text-base font-semibold text-foreground flex items-center gap-2">
          <Icon name="MapPin" size={16} className="text-muted-foreground" /> Location
        </label>
        <Select
          options={locationOptions}
          value={localFilters.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Any Distance"
          className="focus:ring-2 focus:ring-primary rounded-lg hover:bg-blue-50 transition-colors"
        />
      </div>
      <hr className="border-border" />

      {/* Availability */}
      <div className="space-y-2">
        <label className="text-base font-semibold text-foreground flex items-center gap-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" /> Availability
        </label>
        <Select
          options={availabilityOptions}
          value={localFilters.availability}
          onChange={(value) => handleFilterChange('availability', value)}
          placeholder="Any Status"
          className="focus:ring-2 focus:ring-primary rounded-lg hover:bg-blue-50 transition-colors"
        />
      </div>
      <hr className="border-border" />

      {/* Rating */}
      <div className="space-y-2">
        <label className="text-base font-semibold text-foreground flex items-center gap-2">
          <Icon name="Star" size={16} className="text-muted-foreground" /> Minimum Rating
        </label>
        <Select
          options={ratingOptions}
          value={localFilters.rating}
          onChange={(value) => handleFilterChange('rating', value)}
          placeholder="Any Rating"
          className="focus:ring-2 focus:ring-primary rounded-lg hover:bg-blue-50 transition-colors"
        />
      </div>
      <hr className="border-border" />

      {/* Additional Filters */}
      <div className="space-y-2">
        <label className="text-base font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" /> Additional Options
        </label>
        <div className="space-y-2">
          <Checkbox
            label={<span className="flex items-center gap-1"><Icon name="BadgeCheck" size={14} className="text-primary" /> Verified Users Only</span>}
            checked={localFilters.verified}
            onChange={(e) => handleFilterChange('verified', e.target.checked)}
            className="focus:ring-2 focus:ring-primary rounded-lg hover:bg-blue-50 transition-colors"
          />
          <Checkbox
            label={<span className="flex items-center gap-1"><Icon name="MessageSquare" size={14} className="text-primary" /> Users with Reviews</span>}
            checked={localFilters.hasReviews}
            onChange={(e) => handleFilterChange('hasReviews', e.target.checked)}
            className="focus:ring-2 focus:ring-primary rounded-lg hover:bg-blue-50 transition-colors"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <Button
          variant="destructive"
          onClick={handleClearFilters}
          iconName="X"
          iconPosition="left"
          fullWidth
          className="mt-6 py-2 text-base font-bold rounded-xl shadow-md hover:bg-destructive/90 transition-all duration-150"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-gradient-to-b from-white via-blue-50 to-white border border-border p-8 h-full overflow-y-auto rounded-3xl shadow-xl sticky top-24 lg:ml-60 relative">
        {sidebarContent}
        {/* Vertical divider on the right */}
        <div className="hidden lg:block absolute top-0 right-0 h-full w-px bg-border/70" style={{right: '-1rem'}} />
      </div>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl max-h-[80vh] overflow-y-auto shadow-lg">
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