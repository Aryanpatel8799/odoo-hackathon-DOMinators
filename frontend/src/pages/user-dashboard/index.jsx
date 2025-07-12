import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DashboardQuickActions from '../../components/ui/DashboardQuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import dashboard components
import MetricsCard from './components/MetricsCard';
import ActivityFeed from './components/ActivityFeed';
import SkillSearchBar from './components/SkillSearchBar';
import RecommendedMatches from './components/RecommendedMatches';
import NotificationBanner from './components/NotificationBanner';
import { UserDataContext } from '../../context/UserContext';
import { useContext } from 'react';
const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useContext(UserDataContext);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const metricsData = [
    {
      title: 'Active Swaps',
      value: '8',
      icon: 'ArrowLeftRight',
      color: 'bg-primary',
      trend: 'up',
      trendValue: '+2 this week'
    },
    {
      title: 'Pending Requests',
      value: '3',
      icon: 'Clock',
      color: 'bg-warning',
      trend: 'up',
      trendValue: '+1 today'
    },
    {
      title: 'Completed Swaps',
      value: '24',
      icon: 'CheckCircle',
      color: 'bg-success',
      trend: 'up',
      trendValue: '+4 this month'
    },
    {
      title: 'Skill Rating',
      value: '4.8',
      icon: 'Star',
      color: 'bg-accent',
      trend: 'up',
      trendValue: '+0.2 this month'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 flex justify-center">
        <div className="p-6 w-full max-w-5xl mx-auto flex flex-col items-center">
          {/* Welcome Section */}
          <div className="mb-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {getGreeting()}, {user.name}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  {formatDate(currentTime)} • Ready to learn something new today?
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <Link to="/skill-browser-search">
                  <Button
                    variant="outline"
                    iconName="Search"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Browse Skills
                  </Button>
                </Link>
                <Link to="/user-profile-management">
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Add Skill
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Notification Banners */}
          <div className="mb-8 w-full">
            <NotificationBanner />
          </div>

          {/* Skill Search Bar */}
          <div className="mb-8 w-full">
            <SkillSearchBar />
          </div>

          {/* Dashboard Sections Centered and Stacked */}
          <div className="flex flex-col items-center w-full space-y-8">
            {/* Recent Activity */}
            <div className="w-full">
              <ActivityFeed />
            </div>
            {/* Recommended Matches */}
            <div className="w-full">
              <RecommendedMatches />
            </div>
            {/* Quick Stats */}
            <div className="w-full">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Connections</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="BookOpen" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Skills Offered</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Target" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Learning Goals</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">This Week</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">3 sessions</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Recent Messages Preview */}
            <div className="w-full">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Messages</h3>
                  <Link
                    to="/messaging-system"
                    className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Chen', message: 'Thanks for the React session!', time: '2m ago', unread: true },
                    { name: 'Mike Johnson', message: 'When can we schedule the next...', time: '1h ago', unread: false },
                    { name: 'Emma Wilson', message: 'Great photography tips today', time: '3h ago', unread: false }
                  ].map((msg, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={14} color="white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate">{msg.name}</p>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                      </div>
                      {msg.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;