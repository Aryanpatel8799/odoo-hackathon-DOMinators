import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import SwapRequestCard from './components/SwapRequestCard';
import SwapFilters from './components/SwapFilters';
import SwapTabs from './components/SwapTabs';
import SwapStatsCards from './components/SwapStatsCards';
import EmptyState from './components/EmptyState';
import RatingModal from './components/RatingModal';

import Button from '../../components/ui/Button';

const SwapRequestManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'newest',
    category: 'all',
    direction: 'all'
  });
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Mock data for swap requests
  const mockSwaps = [
    {
      id: 1,
      participant: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        location: "San Francisco, CA",
        isOnline: true
      },
      yourSkill: "React Development",
      yourLevel: "Advanced",
      theirSkill: "UI/UX Design",
      theirLevel: "Intermediate",
      proposedTime: new Date(2025, 6, 15, 14, 0),
      duration: "2 hours",
      status: "pending",
      direction: "incoming",
      message: `Hi! I'd love to learn React from you. I have 3 years of UI/UX design experience and can teach you modern design principles, Figma workflows, and user research techniques. I'm particularly interested in learning about React hooks and state management.`,
      createdAt: new Date(2025, 6, 12, 10, 30),
      category: "programming",
      rated: false
    },
    {
      id: 2,
      participant: {
        name: "Marcus Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        location: "Austin, TX",
        isOnline: false
      },
      yourSkill: "Spanish",
      yourLevel: "Native",
      theirSkill: "Guitar Playing",
      theirLevel: "Intermediate",
      proposedTime: new Date(2025, 6, 18, 19, 0),
      duration: "1.5 hours",
      status: "accepted",
      direction: "outgoing",
      message: "Looking forward to our language exchange! I can teach you conversational Spanish and help with pronunciation.",
      createdAt: new Date(2025, 6, 10, 16, 45),
      category: "languages",
      rated: false
    },
    {
      id: 3,
      participant: {
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        location: "New York, NY",
        isOnline: true
      },
      yourSkill: "Digital Marketing",
      yourLevel: "Expert",
      theirSkill: "Photography",
      theirLevel: "Advanced",
      proposedTime: new Date(2025, 6, 8, 11, 0),
      duration: "3 hours",
      status: "completed",
      direction: "incoming",
      message: "I\'d love to learn about SEO and social media marketing strategies. I can teach you portrait photography and photo editing in return.",
      createdAt: new Date(2025, 6, 5, 9, 15),
      category: "marketing",
      rated: false
    },
    {
      id: 4,
      participant: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        location: "Seattle, WA",
        isOnline: true
      },
      yourSkill: "Python Programming",
      yourLevel: "Advanced",
      theirSkill: "Data Analysis",
      theirLevel: "Expert",
      proposedTime: new Date(2025, 6, 20, 13, 30),
      duration: "2.5 hours",
      status: "pending",
      direction: "outgoing",
      message: "I\'m interested in learning advanced data analysis techniques with pandas and numpy. I can help you with Python web development using Django.",
      createdAt: new Date(2025, 6, 11, 14, 20),
      category: "programming",
      rated: false
    },
    {
      id: 5,
      participant: {
        name: "Lisa Thompson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        location: "Chicago, IL",
        isOnline: false
      },
      yourSkill: "Cooking",
      yourLevel: "Intermediate",
      theirSkill: "Yoga",
      theirLevel: "Advanced",
      proposedTime: new Date(2025, 6, 3, 18, 0),
      duration: "2 hours",
      status: "completed",
      direction: "incoming",
      message: "I\'d love to learn some healthy cooking techniques and meal prep strategies. I can teach you various yoga poses and meditation techniques.",
      createdAt: new Date(2025, 5, 28, 12, 0),
      category: "fitness",
      rated: true
    }
  ];

  // Filter and sort swaps based on active tab and filters
  const getFilteredSwaps = () => {
    let filtered = mockSwaps;

    // Filter by tab
    switch (activeTab) {
      case 'pending':
        filtered = filtered.filter(swap => swap.status === 'pending');
        break;
      case 'accepted':
        filtered = filtered.filter(swap => swap.status === 'accepted');
        break;
      case 'history':
        filtered = filtered.filter(swap => swap.status === 'completed' || swap.status === 'rejected');
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
    total: mockSwaps.length,
    pending: mockSwaps.filter(swap => swap.status === 'pending').length,
    active: mockSwaps.filter(swap => swap.status === 'accepted').length,
    completed: mockSwaps.filter(swap => swap.status === 'completed').length
  };

  // Calculate tab counts
  const tabCounts = {
    pending: mockSwaps.filter(swap => swap.status === 'pending').length,
    accepted: mockSwaps.filter(swap => swap.status === 'accepted').length,
    history: mockSwaps.filter(swap => swap.status === 'completed' || swap.status === 'rejected').length
  };

  // Event handlers
  const handleAcceptSwap = (swapId) => {
    console.log('Accepting swap:', swapId);
    // Implementation would update swap status to 'accepted'
  };

  const handleRejectSwap = (swapId) => {
    console.log('Rejecting swap:', swapId);
    // Implementation would update swap status to 'rejected'
  };

  const handleCounterOffer = (swapId) => {
    console.log('Counter offering swap:', swapId);
    // Implementation would open counter-offer modal
  };

  const handleMessage = (swapId) => {
    console.log('Opening message for swap:', swapId);
    navigate('/messaging-system');
  };

  const handleCompleteSwap = (swapId) => {
    console.log('Completing swap:', swapId);
    // Implementation would update swap status to 'completed'
  };

  const handleRateSwap = (swapId) => {
    const swap = mockSwaps.find(s => s.id === swapId);
    setSelectedSwap(swap);
    setIsRatingModalOpen(true);
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
      <Sidebar />
      
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