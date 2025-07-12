import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import UserCard from './components/UserCard';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import ViewToggle from './components/ViewToggle';
import SkeletonCard from './components/SkeletonCard';

const SkillBrowserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    availability: '',
    rating: '',
    verified: false,
    hasReviews: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Mock user data
  const mockUsers = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      location: "San Francisco, CA",
      availability: "available",
      rating: 4.8,
      reviewCount: 24,
      verified: true,
      skills: [
        { name: "React", level: "advanced" },
        { name: "UI/UX Design", level: "intermediate" },
        { name: "JavaScript", level: "advanced" },
        { name: "Figma", level: "intermediate" }
      ]
    },
    {
      id: 2,
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      location: "New York, NY",
      availability: "busy",
      rating: 4.6,
      reviewCount: 18,
      verified: true,
      skills: [
        { name: "Python", level: "advanced" },
        { name: "Data Science", level: "advanced" },
        { name: "Machine Learning", level: "intermediate" },
        { name: "SQL", level: "advanced" }
      ]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      location: "Austin, TX",
      availability: "available",
      rating: 4.9,
      reviewCount: 32,
      verified: false,
      skills: [
        { name: "Photography", level: "advanced" },
        { name: "Lightroom", level: "advanced" },
        { name: "Photoshop", level: "intermediate" },
        { name: "Video Editing", level: "beginner" }
      ]
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      location: "Seattle, WA",
      availability: "available",
      rating: 4.7,
      reviewCount: 15,
      verified: true,
      skills: [
        { name: "Guitar", level: "advanced" },
        { name: "Music Theory", level: "intermediate" },
        { name: "Songwriting", level: "intermediate" },
        { name: "Piano", level: "beginner" }
      ]
    },
    {
      id: 5,
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      location: "Denver, CO",
      availability: "away",
      rating: 4.5,
      reviewCount: 21,
      verified: true,
      skills: [
        { name: "Yoga", level: "advanced" },
        { name: "Meditation", level: "advanced" },
        { name: "Nutrition", level: "intermediate" },
        { name: "Fitness Training", level: "intermediate" }
      ]
    },
    {
      id: 6,
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      location: "Los Angeles, CA",
      availability: "available",
      rating: 4.4,
      reviewCount: 12,
      verified: false,
      skills: [
        { name: "Spanish", level: "advanced" },
        { name: "French", level: "intermediate" },
        { name: "Translation", level: "advanced" },
        { name: "Writing", level: "intermediate" }
      ]
    },
    {
      id: 7,
      name: "Jennifer Park",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      location: "Chicago, IL",
      availability: "available",
      rating: 4.8,
      reviewCount: 28,
      verified: true,
      skills: [
        { name: "Cooking", level: "advanced" },
        { name: "Baking", level: "advanced" },
        { name: "Food Photography", level: "intermediate" },
        { name: "Recipe Development", level: "advanced" }
      ]
    },
    {
      id: 8,
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      location: "Boston, MA",
      availability: "busy",
      rating: 4.6,
      reviewCount: 19,
      verified: true,
      skills: [
        { name: "Digital Marketing", level: "advanced" },
        { name: "SEO", level: "advanced" },
        { name: "Content Strategy", level: "intermediate" },
        { name: "Analytics", level: "intermediate" }
      ]
    }
  ];

  // Simulate API call with debouncing
  const searchUsers = useCallback(async (query, currentFilters, sort, pageNum = 1) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredUsers = [...mockUsers];
    
    // Apply search filter
    if (query) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.skills.some(skill => skill.name.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // Apply filters
    if (currentFilters.availability) {
      filteredUsers = filteredUsers.filter(user => user.availability === currentFilters.availability);
    }
    
    if (currentFilters.verified) {
      filteredUsers = filteredUsers.filter(user => user.verified);
    }
    
    if (currentFilters.rating) {
      const minRating = parseInt(currentFilters.rating);
      filteredUsers = filteredUsers.filter(user => user.rating >= minRating);
    }
    
    // Apply sorting
    switch (sort) {
      case 'rating':
        filteredUsers.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        // Mock recent activity sort
        filteredUsers.sort((a, b) => b.id - a.id);
        break;
      default:
        // Relevance - keep original order
        break;
    }
    
    // Simulate pagination
    const itemsPerPage = 8;
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    if (pageNum === 1) {
      setUsers(paginatedUsers);
    } else {
      setUsers(prev => [...prev, ...paginatedUsers]);
    }
    
    setHasMore(endIndex < filteredUsers.length);
    setIsLoading(false);
  }, []);

  // Initial load and search effect
  useEffect(() => {
    setPage(1);
    searchUsers(searchQuery, filters, sortBy, 1);
  }, [searchQuery, filters, sortBy, searchUsers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...filters };
    if (filterKey === 'verified' || filterKey === 'hasReviews') {
      newFilters[filterKey] = false;
    } else {
      newFilters[filterKey] = '';
    }
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({
      category: '',
      location: '',
      availability: '',
      rating: '',
      verified: false,
      hasReviews: false
    });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchUsers(searchQuery, filters, sortBy, nextPage);
  };

  const getResultsText = () => {
    if (isLoading && users.length === 0) return "Searching...";
    if (users.length === 0) return "No users found";
    if (users.length === 1) return "1 user found";
    return `${users.length} users found`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Filter Sidebar */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Header */}
              <div className="bg-card border-b border-border p-6">
                <div className="max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-3xl font-bold text-foreground mb-2">Discover Skills</h1>
                    <p className="text-muted-foreground mb-6">Find amazing people to exchange skills with</p>
                    
                    <SearchBar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onSearch={handleSearch}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="bg-card border-b border-border p-4">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsFilterOpen(true)}
                        iconName="Filter"
                        iconPosition="left"
                        className="lg:hidden"
                      >
                        Filters
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {getResultsText()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <SortDropdown
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                      />
                      <ViewToggle
                        viewMode={viewMode}
                        onViewChange={setViewMode}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Chips */}
              <div className="bg-background">
                <div className="max-w-7xl mx-auto px-4">
                  <FilterChips
                    filters={filters}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAllFilters}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`grid gap-6 ${
                      viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
                    }`}
                  >
                    {users.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <UserCard user={user} viewMode={viewMode} />
                      </motion.div>
                    ))}
                    
                    {/* Loading Skeletons */}
                    {isLoading && (
                      Array.from({ length: 4 }, (_, index) => (
                        <SkeletonCard key={`skeleton-${index}`} viewMode={viewMode} />
                      ))
                    )}
                  </motion.div>

                  {/* Load More Button */}
                  {!isLoading && hasMore && users.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        iconName="ChevronDown"
                        iconPosition="right"
                      >
                        Load More Users
                      </Button>
                    </div>
                  )}

                  {/* No Results */}
                  {!isLoading && users.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Search" size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No users found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search criteria or filters
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleClearAllFilters}
                        iconName="RotateCcw"
                        iconPosition="left"
                      >
                        Clear Filters
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkillBrowserSearch;