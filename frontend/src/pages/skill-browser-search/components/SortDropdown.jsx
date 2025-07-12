import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: 'Target' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'distance', label: 'Nearest First', icon: 'MapPin' },
    { value: 'recent', label: 'Recently Active', icon: 'Clock' },
    { value: 'alphabetical', label: 'A to Z', icon: 'ArrowUpDown' }
  ];

  const currentSort = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName={currentSort.icon}
        iconPosition="left"
        className="min-w-[140px] justify-between"
      >
        <span className="flex-1 text-left">{currentSort.label}</span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 animate-fade-in">
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                  sortBy === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={option.icon} size={16} className="mr-3" />
                {option.label}
                {sortBy === option.value && (
                  <Icon name="Check" size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;