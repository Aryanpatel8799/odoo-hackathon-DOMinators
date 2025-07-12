import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import UserCard from './components/UserCard';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import ViewToggle from './components/ViewToggle';
import UserCardSkeleton from './components/UserCardSkeleton';
import swapService from '../../services/swapService';

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
  const [error, setError] = useState(null);

  // Load users from API
  const loadUsers = useCallback(async (query, currentFilters, sort, pageNum = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await swapService.getUsers({
        search: query,
        ...currentFilters,
        sort,
        page: pageNum
      });
      
      // Handle new API response structure
      const responseData = response.data || {};
      const fetchedUsers = responseData.users || [];
      const pagination = responseData.pagination || {};
      
      if (pageNum === 1) {
        setUsers(fetchedUsers);
      } else {
        setUsers(prev => [...prev, ...fetchedUsers]);
      }
      
      setHasMore(pagination.hasMore || fetchedUsers.length === 12);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]); // No mock data fallback
      setHasMore(false);
      
      // Check for authentication errors
      if (error.message.includes('unauthorized') || error.message.includes('Unauthorized') || error.message.includes('User is unauthorized')) {
        setError('User is unauthorized');
      } else {
        setError('Failed to load users. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use the new loadUsers function
  const searchUsers = loadUsers;

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
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-10 px-4 sm:px-8 mb-8 rounded-b-3xl shadow-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">Browse Skills & Find Your Match</h1>
            <p className="text-muted-foreground mb-6">Discover people to swap skills with. Search, filter, and connect with the perfect learning partner!</p>
            <div className="max-w-xl mx-auto">
              <SearchBar value={searchQuery} onChange={handleSearch} />
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col gap-6">
            {/* Filter Button Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition-colors"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Icon name="Sliders" size={18} className="mr-2" />
                  Filters
                </button>
                <div className="text-lg font-semibold text-foreground ml-4">{getResultsText()}</div>
              </div>
              <div className="flex items-center gap-2">
                <SortDropdown value={sortBy} onChange={setSortBy} />
                <ViewToggle value={viewMode} onChange={setViewMode} />
              </div>
            </div>
            {/* Main Content */}
            <section className="flex-1 min-w-0">
              {/* User Grid */}
              {error ? (
                error.includes('unauthorized') || error.includes('Unauthorized') || error.includes('User is unauthorized') ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <Icon name="Lock" size={48} className="text-destructive mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Please log in to browse skills</h3>
                    <p className="text-muted-foreground mb-4">You must be signed in to view and connect with other users.</p>
                    <Button variant="default" onClick={() => window.location.href = '/o-auth-sign-in'} iconName="LogIn" iconPosition="left">Go to Login</Button>
                  </div>
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <Icon name="AlertTriangle" size={48} className="text-destructive mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button variant="outline" onClick={() => loadUsers(searchQuery, filters, sortBy, 1)} iconName="RotateCcw" iconPosition="left">Retry</Button>
                  </div>
                )
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : ''}`}>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <UserCardSkeleton key={i} viewMode={viewMode} />)
                    : users.length > 0
                      ? users.map(user => <UserCard key={user.id} user={user} viewMode={viewMode} />)
                      : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16">
                          <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
                          <h3 className="text-xl font-semibold mb-2">No users found</h3>
                          <p className="text-muted-foreground mb-4">Try adjusting your search or filters to find more people.</p>
                          <Button variant="outline" onClick={handleClearAllFilters} iconName="RotateCcw" iconPosition="left">Clear Filters</Button>
                        </div>
                      )}
                </div>
              )}
              {/* Load More Button */}
              {hasMore && !isLoading && users.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="default" onClick={handleLoadMore} iconName="ChevronDown" iconPosition="left">Load More</Button>
                </div>
              )}
            </section>
          </div>
        </div>
        {/* Filter Dialog */}
        {isFilterOpen && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all" />
            {/* Filter Sidebar Modal */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default SkillBrowserSearch;