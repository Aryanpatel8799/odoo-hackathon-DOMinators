import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import MetricsCards from './components/MetricsCards';
import UserManagementTable from './components/UserManagementTable';
import SwapStatistics from './components/SwapStatistics';
import NotificationSystem from './components/NotificationSystem';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';

const AdminPanelDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, usersResponse] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAllUsers()
        ]);
        
        setDashboardStats(statsResponse.data);
        setUsers(usersResponse.data.users || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers()
      ]);
      
      setDashboardStats(statsResponse.data);
      setUsers(usersResponse.data.users || []);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefreshData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                iconName="RefreshCw" 
                iconPosition="left"
                onClick={handleRefreshData}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                Export Report
              </Button>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-md">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs font-medium text-success">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-8">
          {/* Platform Metrics */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="BarChart3" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Platform Overview</h2>
            </div>
            <MetricsCards stats={dashboardStats} />
          </section>

          {/* User Management */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Users" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">User Management</h2>
            </div>
            <UserManagementTable users={users} onUserUpdate={handleRefreshData} />
          </section>

          {/* Analytics and Notifications Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Swap Statistics */}
            <div className="xl:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="TrendingUp" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Analytics & Statistics</h2>
              </div>
              <SwapStatistics />
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="Bell" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">System Alerts</h2>
              </div>
              <NotificationSystem />
            </div>
          </div>

          {/* Quick Actions */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Zap" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Administrative Tools</h2>
            </div>
            <QuickActions />
          </section>

          {/* System Status Footer */}
          <section className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Server" size={20} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Server Status: Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={20} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Database: Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Wifi" size={20} className="text-success" />
                  <span className="text-sm font-medium text-foreground">API: Responsive</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPanelDashboard;