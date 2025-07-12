import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SwapRequestCard from './components/SwapRequestCard';
import SwapFilters from './components/SwapFilters';
import SwapTabs from './components/SwapTabs';
import SwapStatsCards from './components/SwapStatsCards';
import EmptyState from './components/EmptyState';
import RatingModal from './components/RatingModal';
import swapService from '../../services/swapService';
import { SWAP_STATUS } from '../../config';
import { useToast } from '../../context/ToastContext';
import { UserDataContext } from '../../context/UserContext';

import Button from '../../components/ui/Button';

const SwapRequestManagement = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user: currentUser } = useContext(UserDataContext);
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'newest',
    category: 'all',
    direction: 'all'
  });
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [swaps, setSwaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load swaps from API
  const loadSwaps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await swapService.getMySwaps();
      console.log('Loaded swaps:', response.data);
      setSwaps(response.data || []);
    } catch (err) {
      console.error('Error loading swaps:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSwaps();
  }, []);

  // Transform API data to match component expectations
  const transformSwapData = (swap) => {
    // The backend now includes direction information
    const isIncoming = swap.direction === 'incoming';
    const otherUser = isIncoming ? swap.offeredBy : swap.requestedFrom;
    
    console.log('Transforming swap:', {
      swapId: swap._id,
      direction: swap.direction,
      isIncoming,
      status: swap.status,
      otherUser: otherUser?.name,
      offeredBy: swap.offeredBy?.name,
      requestedFrom: swap.requestedFrom?.name
    });
    
    return {
      id: swap._id,
      participant: {
        name: otherUser.name,
        avatar: otherUser.profileIMG || otherUser.avatar,
        location: otherUser.location || 'Location not specified',
        isOnline: otherUser.availability === 'available'
      },
      yourSkill: isIncoming ? swap.wantedSkill : swap.offeredSkill,
      yourLevel: "Intermediate", // This would need to come from user's skill level
      theirSkill: isIncoming ? swap.offeredSkill : swap.wantedSkill,
      theirLevel: "Advanced", // This would need to come from other user's skill level
      proposedTime: new Date(swap.createdAt),
      duration: "2 hours", // This could be added to the swap model
      status: swap.status,
      direction: isIncoming ? "incoming" : "outgoing",
      message: swap.message || "No message provided",
      createdAt: new Date(swap.createdAt),
      category: "programming", // This could be derived from skills
      rated: false
    };
  };

  const transformedSwaps = swaps.map(transformSwapData);

  // Filter and sort swaps based on active tab and filters
  const getFilteredSwaps = () => {
    let filtered = transformedSwaps;

    // Filter by tab
    switch (activeTab) {
      case 'pending':
        filtered = filtered.filter(swap => swap.status === 'pending');
        break;
      case 'accepted':
        filtered = filtered.filter(swap => swap.status === 'accepted');
        break;
      case 'history':
        filtered = filtered.filter(swap => swap.status === 'completed' || swap.status === 'rejected' || swap.status === 'cancelled');
        break;
    }

    // Apply additional filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(swap => swap.status === filters.status);
    }

    if (filters.direction !== 'all') {
      filtered = filtered.filter(swap => swap.direction === filters.direction);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(swap => swap.category === filters.category);
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.proposedTime) - new Date(b.proposedTime));
        break;
      case 'skill':
        filtered.sort((a, b) => a.theirSkill.localeCompare(b.theirSkill));
        break;
    }

    return filtered;
  };

  // Calculate stats
  const stats = {
    total: transformedSwaps.length,
    pending: transformedSwaps.filter(swap => swap.status === 'pending').length,
    active: transformedSwaps.filter(swap => swap.status === 'accepted').length,
    completed: transformedSwaps.filter(swap => swap.status === 'completed').length
  };

  // Calculate tab counts
  const tabCounts = {
    pending: transformedSwaps.filter(swap => swap.status === 'pending').length,
    accepted: transformedSwaps.filter(swap => swap.status === 'accepted').length,
    history: transformedSwaps.filter(swap => swap.status === 'completed' || swap.status === 'rejected' || swap.status === 'cancelled').length
  };

  // Event handlers
  const handleAcceptSwap = async (swapId) => {
    console.log('Accepting swap:', swapId);
    try {
      await swapService.acceptSwap(swapId);
      await loadSwaps(); // Reload swaps after action
      showSuccess('Swap request accepted successfully!');
    } catch (error) {
      console.error('Error accepting swap:', error);
      showError(error.message || 'Failed to accept swap request');
    }
  };

  const handleRejectSwap = async (swapId) => {
    try {
      await swapService.rejectSwap(swapId);
      await loadSwaps(); // Reload swaps after action
      showSuccess('Swap request rejected');
    } catch (error) {
      console.error('Error rejecting swap:', error);
      showError(error.message || 'Failed to reject swap request');
    }
  };

  const handleCounterOffer = (swapId) => {
    console.log('Counter offering swap:', swapId);
    // Implementation would open counter-offer modal
  };

  const handleMessage = (swapId) => {
    console.log('Opening message for swap:', swapId);
    navigate('/messaging-system');
  };

  const handleCompleteSwap = async (swapId) => {
    try {
      await swapService.completeSwap(swapId);
      await loadSwaps(); // Reload swaps after action
      showSuccess('Swap marked as completed successfully!');
    } catch (error) {
      console.error('Error completing swap:', error);
      showError(error.message || 'Failed to complete swap');
    }
  };

  const handleRateSwap = (swapId) => {
    const swap = transformedSwaps.find(s => s.id === swapId);
    setSelectedSwap(swap);
    setIsRatingModalOpen(true);
  };

  const handleCancelSwap = async (swapId) => {
    try {
      await swapService.cancelSwap(swapId);
      await loadSwaps(); // Reload swaps after action
      showSuccess('Swap request cancelled successfully');
    } catch (error) {
      console.error('Error canceling swap:', error);
      showError(error.message || 'Failed to cancel swap request');
    }
  };

  const handleSubmitRating = async (ratingData) => {
    console.log('Submitting rating:', ratingData);
    // Implementation would submit rating to backend
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      sort: 'newest',
      category: 'all',
      direction: 'all'
    });
  };

  const filteredSwaps = getFilteredSwaps();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="lg:pl-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground">Swap Management</h1>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                onClick={() => navigate('/skill-browser-search')}
              >
                New Request
              </Button>
            </div>
            <p className="text-muted-foreground">
              Manage your skill exchange requests and track your learning progress
            </p>
          </div>

          {/* Stats Cards */}
          <SwapStatsCards stats={stats} />

          {/* Tabs */}
          <SwapTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={tabCounts}
          />

          {/* Filters */}
          <SwapFilters
            onFilterChange={setFilters}
            activeFilters={filters}
          />

          {/* Swap List */}
          {filteredSwaps.length > 0 ? (
            <div className="space-y-4">
              {filteredSwaps.map((swap) => (
                <SwapRequestCard
                  key={swap.id}
                  swap={swap}
                  onAccept={handleAcceptSwap}
                  onReject={handleRejectSwap}
                  onCounterOffer={handleCounterOffer}
                  onMessage={handleMessage}
                  onComplete={handleCompleteSwap}
                  onRate={handleRateSwap}
                  onCancel={handleCancelSwap}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type={activeTab}
              onCreateRequest={handleClearFilters}
            />
          )}
        </div>
      </main>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        swap={selectedSwap}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
};

export default SwapRequestManagement;