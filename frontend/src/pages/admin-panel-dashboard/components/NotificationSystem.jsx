import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'moderation',
      title: 'User Report Pending',
      message: 'Sarah Johnson has been reported for inappropriate behavior during a skill swap.',
      timestamp: new Date(Date.now() - 300000),
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'system',
      title: 'Server Maintenance Scheduled',
      message: 'Scheduled maintenance window on July 15th from 2:00 AM to 4:00 AM UTC.',
      timestamp: new Date(Date.now() - 1800000),
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      title: 'High Traffic Alert',
      message: 'Platform experiencing 150% higher than normal traffic. Monitor performance.',
      timestamp: new Date(Date.now() - 3600000),
      priority: 'high',
      read: true
    },
    {
      id: 4,
      type: 'moderation',
      title: 'Content Flagged',
      message: 'A skill description has been flagged for review by multiple users.',
      timestamp: new Date(Date.now() - 7200000),
      priority: 'medium',
      read: false
    },
    {
      id: 5,
      type: 'system',
      title: 'Backup Completed',
      message: 'Daily database backup completed successfully at 3:00 AM UTC.',
      timestamp: new Date(Date.now() - 10800000),
      priority: 'low',
      read: true
    }
  ]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      moderation: 'AlertTriangle',
      system: 'Settings',
      alert: 'Bell'
    };
    return iconMap[type] || 'Info';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-destructive';
    if (priority === 'medium') return 'text-warning';
    return 'text-muted-foreground';
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-destructive text-destructive-foreground', label: 'High' },
      medium: { color: 'bg-warning text-warning-foreground', label: 'Medium' },
      low: { color: 'bg-muted text-muted-foreground', label: 'Low' }
    };

    const config = priorityConfig[priority];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" iconName="Settings" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-muted/50 transition-colors duration-150 ${
                  !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${getNotificationColor(notification.type, notification.priority)}`}>
                    <Icon name={getNotificationIcon(notification.type)} size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(notification.priority)}
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-sm ${
                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => deleteNotification(notification.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {notifications.length} total notifications
          </p>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;