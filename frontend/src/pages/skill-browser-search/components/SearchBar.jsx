import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ searchQuery, onSearchChange, onSearch }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState([
    "JavaScript", "React", "Python", "UI/UX Design", "Digital Marketing"
  ]);
  const [popularSkills] = useState([
    "Web Development", "Data Science", "Graphic Design", "Photography", "Cooking", "Language Exchange"
  ]);
  
  const searchRef = useRef(null);

  const suggestions = [
    "JavaScript Programming",
    "React Development", 
    "Python Data Science",
    "UI/UX Design",
    "Digital Marketing",
    "Photography Basics",
    "Cooking Techniques",
    "Spanish Language",
    "Guitar Playing",
    "Yoga Instruction"
  ];

  // Defensive: always treat searchQuery as a string
  const safeQuery = typeof searchQuery === 'string' ? searchQuery : '';
  const filteredSuggestions = suggestions.filter(skill =>
    typeof skill === 'string' && skill.toLowerCase().includes(safeQuery.toLowerCase()) && 
    skill.toLowerCase() !== safeQuery.toLowerCase()
  ).slice(0, 5);

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleQuickChipClick = (skill) => {
    onSearchChange(skill);
    onSearch(skill);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for skills, expertise, or interests..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleInputFocus}
          className="pl-12 pr-12 h-12 text-base"
        />
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('');
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 max-h-96 overflow-y-auto">
          {/* Search Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-3 border-b border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggestions</h4>
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <Icon name="Search" size={16} className="mr-3 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickChipClick(search)}
                    className="inline-flex items-center px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon name="Clock" size={12} className="mr-1" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Skills */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Popular Skills</h4>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickChipClick(skill)}
                  className="inline-flex items-center px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon name="TrendingUp" size={12} className="mr-1" />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;