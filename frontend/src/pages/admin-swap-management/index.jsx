import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';

const AdminSwapManagement = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllSwaps();
      setSwaps(response.data.swaps || []);
    } catch (err) {
      console.error('Error fetching swaps:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSwap = async (swapId) => {
    if (window.confirm('Are you sure you want to delete this swap?')) {
      try {
        await adminService.deleteSwap(swapId);
        fetchSwaps(); // Refresh the list
      } catch (error) {
        console.error('Error deleting swap:', error);
        alert('Failed to delete swap');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
      accepted: { color: 'bg-success text-success-foreground', label: 'Accepted' },
      completed: { color: 'bg-primary text-primary-foreground', label: 'Completed' },
      rejected: { color: 'bg-destructive text-destructive-foreground', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredSwaps = swaps.filter(swap => {
    const matchesFilter = filter === 'all' || swap.status === filter;
    const matchesSearch = search === '' || 
      swap.offeredSkill?.toLowerCase().includes(search.toLowerCase()) ||
      swap.wantedSkill?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading swaps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Swaps</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchSwaps} variant="outline">
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
            <h1 className="text-2xl font-bold text-foreground">Swap Management</h1>
            <p className="text-sm text-muted-foreground">Manage all skill exchange requests</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              iconName="RefreshCw" 
              iconPosition="left"
              onClick={fetchSwaps}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search swaps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Swaps List */}
      <main className="p-6">
        <div className="grid gap-4">
          {filteredSwaps.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No swaps found</h3>
              <p className="text-muted-foreground">No swaps match your current filters.</p>
            </div>
          ) : (
            filteredSwaps.map((swap) => (
              <div key={swap._id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="ArrowLeftRight" size={20} className="text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Swap Request</h3>
                      </div>
                      {getStatusBadge(swap.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Offered Skill</h4>
                        <div className="bg-muted px-3 py-2 rounded-md">
                          <span className="text-sm">{swap.offeredSkill}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Wanted Skill</h4>
                        <div className="bg-muted px-3 py-2 rounded-md">
                          <span className="text-sm">{swap.wantedSkill}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Created: {new Date(swap.createdAt).toLocaleDateString()}</p>
                      {swap.offeredBy && (
                        <p>Offered by: {swap.offeredBy.name || swap.offeredBy}</p>
                      )}
                      {swap.requestedFrom && (
                        <p>Requested from: {swap.requestedFrom.name || swap.requestedFrom}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => console.log('View swap details')}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => handleDeleteSwap(swap._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSwapManagement; 