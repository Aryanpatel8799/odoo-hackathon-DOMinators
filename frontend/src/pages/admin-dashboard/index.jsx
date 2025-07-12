import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      showError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminService.logout();
      showSuccess('Logged out successfully');
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Logout failed');
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} color="white" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin-users')}
            >
              Manage Users
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin-swaps')}
            >
              Manage Swaps
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Users Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.users.total}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
              </div>
              <div className="mt-4 flex space-x-2 text-sm">
                <span className="text-success">{stats.users.active} active</span>
                <span className="text-destructive">{stats.users.banned} banned</span>
              </div>
            </div>

            {/* Swaps Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Swaps</p>
                  <p className="text-2xl font-bold text-foreground">{stats.swaps.total}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="ArrowLeftRight" size={24} className="text-secondary" />
                </div>
              </div>
              <div className="mt-4 flex space-x-2 text-sm">
                <span className="text-warning">{stats.swaps.pending} pending</span>
                <span className="text-success">{stats.swaps.accepted} accepted</span>
                <span className="text-primary">{stats.swaps.completed} completed</span>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Recent Users</p>
                <Icon name="UserPlus" size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {stats.recentActivity.users.slice(0, 3).map((user, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Swaps */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Recent Swaps</p>
                <Icon name="ArrowLeftRight" size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {stats.recentActivity.swaps.slice(0, 3).map((swap, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm text-foreground">
                      {swap.offeredBy?.name} ↔ {swap.requestedFrom?.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin-users')}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Icon name="Users" size={24} />
              <span>Manage Users</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/admin-swaps')}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Icon name="ArrowLeftRight" size={24} />
              <span>Manage Swaps</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/admin-login')}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Icon name="Settings" size={24} />
              <span>Admin Settings</span>
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm font-medium">Backend Server</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm font-medium">Database</span>
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 