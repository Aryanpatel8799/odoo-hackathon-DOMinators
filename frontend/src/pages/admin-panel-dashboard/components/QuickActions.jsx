import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');

  const quickActions = [
    {
      title: 'Send Announcement',
      description: 'Broadcast message to all users',
      icon: 'Megaphone',
      color: 'bg-primary',
      action: () => setShowAnnouncementModal(true)
    },
    {
      title: 'Export User Data',
      description: 'Download user analytics report',
      icon: 'Download',
      color: 'bg-success',
      action: () => console.log('Exporting user data...')
    },
    {
      title: 'System Backup',
      description: 'Create manual system backup',
      icon: 'Database',
      color: 'bg-secondary',
      action: () => console.log('Creating backup...')
    },
    {
      title: 'Maintenance Mode',
      description: 'Enable platform maintenance',
      icon: 'Settings',
      color: 'bg-warning',
      action: () => console.log('Enabling maintenance mode...')
    }
  ];

  const recentActions = [
    {
      action: 'User banned',
      target: 'david.thompson@email.com',
      timestamp: new Date(Date.now() - 1800000),
      admin: 'Admin User'
    },
    {
      action: 'Announcement sent',
      target: 'All users',
      timestamp: new Date(Date.now() - 3600000),
      admin: 'Admin User'
    },
    {
      action: 'Report resolved',
      target: 'Swap #1247',
      timestamp: new Date(Date.now() - 7200000),
      admin: 'Admin User'
    },
    {
      action: 'User promoted',
      target: 'sarah.johnson@email.com',
      timestamp: new Date(Date.now() - 10800000),
      admin: 'Admin User'
    }
  ];

  const handleSendAnnouncement = () => {
    if (announcementText.trim()) {
      console.log('Sending announcement:', announcementText);
      setAnnouncementText('');
      setShowAnnouncementModal(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group p-4 bg-muted rounded-lg hover:bg-muted/80 transition-all duration-200 text-left"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={action.icon} size={20} color="white" />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">{action.title}</h4>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Admin Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Admin Actions</h3>
          <Button variant="outline" size="sm" iconName="History">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {action.action}: <span className="text-muted-foreground">{action.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">by {action.admin}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(action.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Megaphone" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Send Announcement</h3>
                <p className="text-sm text-muted-foreground">Broadcast message to all platform users</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Announcement Message
                </label>
                <textarea
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Enter your announcement message..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSendAnnouncement}
                  disabled={!announcementText.trim()}
                >
                  Send Announcement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;