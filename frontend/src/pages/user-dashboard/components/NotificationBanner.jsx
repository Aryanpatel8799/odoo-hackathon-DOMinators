import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to SkillSwap!',
      message: 'Complete your profile to get better skill matches and increase your visibility.',
      actionText: 'Complete Profile',
      actionPath: '/user-profile-management',
      dismissible: true,
      priority: 'high'
    },
    {
      id: 2,
      type: 'success',
      title: 'Profile Verification Complete',
      message: 'Your email has been verified. You can now participate in skill exchanges.',
      dismissible: true,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Pending Swap Requests',
      message: 'You have 3 pending swap requests that need your attention.',
      actionText: 'View Requests',
      actionPath: '/swap-request-management',
      dismissible: true,
      priority: 'high'
    }
  ]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationStyles = (type) => {
    const styles = {
      info: {
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        text: 'text-primary',
        icon: 'Info'
      },
      success: {
        bg: 'bg-success/10',
        border: 'border-success/20',
        text: 'text-success',
        icon: 'CheckCircle'
      },
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        text: 'text-warning',
        icon: 'AlertTriangle'
      },
      error: {
        bg: 'bg-destructive/10',
        border: 'border-destructive/20',
        text: 'text-destructive',
        icon: 'AlertCircle'
      }
    };
    return styles[type] || styles.info;
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const styles = getNotificationStyles(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`${styles.bg} ${styles.border} border rounded-lg p-4 animate-fade-in`}
          >
            <div className="flex items-start space-x-3">
              <div className={`${styles.text} flex-shrink-0 mt-0.5`}>
                <Icon name={styles.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${styles.text}`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-foreground mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    {notification.actionText && notification.actionPath && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Navigate to action path
                            window.location.href = notification.actionPath;
                          }}
                          className="text-xs"
                        >
                          {notification.actionText}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {notification.dismissible && (
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className={`${styles.text} hover:opacity-70 transition-opacity duration-200 ml-4 flex-shrink-0`}
                    >
                      <Icon name="X" size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationBanner;