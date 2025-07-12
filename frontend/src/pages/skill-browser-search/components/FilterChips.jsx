import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ filters, onRemoveFilter, onClearAll }) => {
  const getFilterLabel = (key, value) => {
    const labels = {
      category: {
        'technology': 'Technology',
        'design': 'Design',
        'business': 'Business',
        'languages': 'Languages',
        'arts': 'Arts & Crafts',
        'fitness': 'Fitness & Health',
        'cooking': 'Cooking',
        'music': 'Music',
        'photography': 'Photography',
        'writing': 'Writing'
      },
      location: {
        '5': 'Within 5 miles',
        '10': 'Within 10 miles',
        '25': 'Within 25 miles',
        '50': 'Within 50 miles',
        'remote': 'Remote Only'
      },
      availability: {
        'available': 'Available Now',
        'busy': 'Busy',
        'away': 'Away'
      },
      rating: {
        '4': '4+ Stars',
        '3': '3+ Stars',
        '2': '2+ Stars',
        '1': '1+ Stars'
      },
      verified: 'Verified Users',
      hasReviews: 'Has Reviews'
    };

    if (key === 'verified' || key === 'hasReviews') {
      return value ? labels[key] : null;
    }

    return labels[key]?.[value] || value;
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        const label = getFilterLabel(key, value);
        if (label) {
          activeFilters.push({ key, value, label });
        }
      }
    });

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg">
      <span className="text-sm font-medium text-foreground">Active Filters:</span>
      
      {activeFilters.map((filter, index) => (
        <div
          key={index}
          className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
        >
          <span>{filter.label}</span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-2 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
          >
            <Icon name="X" size={12} />
          </button>
        </div>
      ))}

      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          iconName="X"
          iconPosition="left"
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      )}
    </div>
  );
};

export default FilterChips;