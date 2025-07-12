import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'swap_request',
      title: 'New swap request received',
      description: 'Sarah Chen wants to learn React in exchange for Python tutoring',
      timestamp: new Date(Date.now() - 1800000),
      icon: 'ArrowLeftRight',
      color: 'bg-primary',
      actionRequired: true
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from Mike Johnson',
      description: 'Thanks for the JavaScript session! When can we schedule the next one?',
      timestamp: new Date(Date.now() - 3600000),
      icon: 'MessageSquare',
      color: 'bg-accent',
      actionRequired: false
    },
    {
      id: 3,
      type: 'swap_completed',
      title: 'Swap completed with Emma Wilson',
      description: 'Photography basics session completed. Please leave a review.',
      timestamp: new Date(Date.now() - 7200000),
      icon: 'CheckCircle',
      color: 'bg-success',
      actionRequired: true
    },
    {
      id: 4,
      type: 'skill_match',
      title: 'New skill match found',
      description: 'Alex Rodriguez is looking for web design help and offers data analysis',
      timestamp: new Date(Date.now() - 10800000),
      icon: 'Users',
      color: 'bg-secondary',
      actionRequired: false
    },
    {
      id: 5,
      type: 'rating_received',
      title: 'New rating received',
      description: 'David Kim rated your Node.js session 5 stars',
      timestamp: new Date(Date.now() - 14400000),
      icon: 'Star',
      color: 'bg-warning',
      actionRequired: false
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon name={activity.icon} size={20} color="white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {activity.description}
                </p>
                
                {activity.actionRequired && (
                  <div className="flex items-center mt-3 space-x-2">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">
                      Action Required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;