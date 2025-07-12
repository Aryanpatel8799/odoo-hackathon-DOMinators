import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SkillSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const skillSuggestions = [
    'JavaScript Programming',
    'React Development',
    'Python Data Science',
    'UI/UX Design',
    'Digital Marketing',
    'Photography',
    'Guitar Playing',
    'Spanish Language',
    'Cooking Techniques',
    'Yoga Instruction',
    'Graphic Design',
    'Content Writing'
  ];

  const filteredSuggestions = skillSuggestions.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  );

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      navigate(`/skill-browser-search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  return (
    <div className="relative">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Find Your Next Skill</h2>
          <p className="text-muted-foreground">
            Discover amazing skills from our community and start learning today
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="Search" size={20} className="text-muted-foreground" />
            </div>
            
            <input
              type="text"
              placeholder="Search for skills like 'JavaScript', 'Photography', 'Guitar'..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-12 pr-24 py-4 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSearch()}
                iconName="Search"
                iconPosition="left"
                iconSize={16}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-2 z-50 max-h-64 overflow-y-auto">
              {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left text-foreground hover:bg-muted transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="Search" size={16} className="text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Skills */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3 text-center">Popular skills:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['JavaScript', 'Python', 'Design', 'Photography', 'Marketing'].map((skill) => (
              <button
                key={skill}
                onClick={() => handleSuggestionClick(skill)}
                className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillSearchBar;