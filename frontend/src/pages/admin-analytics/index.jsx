import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Analytics</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform performance and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button 
              variant="outline" 
              size="sm" 
              iconName="RefreshCw" 
              iconPosition="left"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </header>

      {/* Analytics Content */}
      <main className="p-6 space-y-8">
        {/* Key Metrics */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} color="white" />
                </div>
                <div className="text-right">
                  <span className="text-sm text-success">+12.5%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{analytics?.users?.total || 0}</h3>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                  <Icon name="ArrowLeftRight" size={24} color="white" />
                </div>
                <div className="text-right">
                  <span className="text-sm text-success">+8.2%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{analytics?.swaps?.total || 0}</h3>
              <p className="text-sm text-muted-foreground">Total Swaps</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} color="white" />
                </div>
                <div className="text-right">
                  <span className="text-sm text-destructive">-15.3%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{analytics?.users?.banned || 0}</h3>
              <p className="text-sm text-muted-foreground">Banned Users</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} color="white" />
                </div>
                <div className="text-right">
                  <span className="text-sm text-success">+3.1%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{analytics?.swaps?.completed || 0}</h3>
              <p className="text-sm text-muted-foreground">Completed Swaps</p>
            </div>
          </div>
        </section>

        {/* Swap Statistics */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Swap Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Clock" size={20} className="text-warning" />
                <h3 className="font-semibold text-foreground">Pending</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.swaps?.pending || 0}</p>
              <p className="text-sm text-muted-foreground">Awaiting response</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <h3 className="font-semibold text-foreground">Accepted</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.swaps?.accepted || 0}</p>
              <p className="text-sm text-muted-foreground">In progress</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Star" size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Completed</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.swaps?.completed || 0}</p>
              <p className="text-sm text-muted-foreground">Successfully finished</p>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Users" size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Recent Users</h3>
              </div>
              <div className="space-y-3">
                {analytics?.recentActivity?.users?.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Swaps */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="ArrowLeftRight" size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Recent Swaps</h3>
              </div>
              <div className="space-y-3">
                {analytics?.recentActivity?.swaps?.slice(0, 5).map((swap, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium text-foreground">
                        {swap.offeredSkill} → {swap.wantedSkill}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{swap.status}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Platform Health */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Platform Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <h3 className="font-semibold text-foreground">Server Status</h3>
              </div>
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <h3 className="font-semibold text-foreground">Database</h3>
              </div>
              <p className="text-sm text-muted-foreground">Connected and responsive</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <h3 className="font-semibold text-foreground">API</h3>
              </div>
              <p className="text-sm text-muted-foreground">Response time: 45ms</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <h3 className="font-semibold text-foreground">Uptime</h3>
              </div>
              <p className="text-sm text-muted-foreground">99.9% (Last 30 days)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminAnalytics; 