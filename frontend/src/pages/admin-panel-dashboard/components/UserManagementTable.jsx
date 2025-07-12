import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserManagementTable = () => {
  const [sortField, setSortField] = useState('joinDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      joinDate: "2024-06-15",
      swapCount: 12,
      rating: 4.8,
      status: "active",
      flagged: false,
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      joinDate: "2024-05-22",
      swapCount: 8,
      rating: 4.6,
      status: "active",
      flagged: true,
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      joinDate: "2024-07-01",
      swapCount: 15,
      rating: 4.9,
      status: "active",
      flagged: false,
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@email.com",
      joinDate: "2024-04-10",
      swapCount: 3,
      rating: 3.2,
      status: "suspended",
      flagged: true,
      avatar: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      joinDate: "2024-06-28",
      swapCount: 7,
      rating: 4.4,
      status: "active",
      flagged: false,
      avatar: "https://randomuser.me/api/portraits/women/5.jpg"
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAction = (action, user) => {
    setSelectedAction({ action, user });
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    console.log(`${selectedAction.action} user:`, selectedAction.user.name);
    setShowConfirmModal(false);
    setSelectedAction(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      suspended: { color: 'bg-destructive text-destructive-foreground', label: 'Suspended' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">User Management</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>User</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('joinDate')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Join Date</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('swapCount')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Swaps</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('rating')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Rating</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        {user.flagged && (
                          <Icon name="Flag" size={14} className="text-destructive" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.swapCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm text-foreground">{user.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleAction('view', user)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="AlertTriangle"
                      onClick={() => handleAction('warn', user)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Ban"
                      onClick={() => handleAction('ban', user)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1 to 5 of 2,847 users
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Action</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to {selectedAction?.action} {selectedAction?.user?.name}?
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmAction}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;