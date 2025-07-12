import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';


const DashboardQuickActions = () => {
  const quickActions = [
    {
      title: 'Find Skills',
      description: 'Discover new skills to learn from the community',
      icon: 'Search',
      path: '/skill-browser-search',
      color: 'bg-primary',
      iconColor: 'white'
    },
    {
      title: 'My Active Swaps',
      description: 'Manage your ongoing skill exchanges',
      icon: 'ArrowLeftRight',
      path: '/swap-request-management',
      color: 'bg-secondary',
      iconColor: 'white',
      badge: 3
    },
    {
      title: 'Messages',
      description: 'Chat with your learning partners',
      icon: 'MessageSquare',
      path: '/messaging-system',
      color: 'bg-accent',
      iconColor: 'gray-800',
      badge: 2
    },
    {
      title: 'Update Profile',
      description: 'Showcase your skills and expertise',
      icon: 'User',
      path: '/user-profile-management',
      color: 'bg-success',
      iconColor: 'white'
    }
  ];

  const handleQuickAction = (path) => {
    // Analytics or tracking logic can be added here
    console.log(`Quick action clicked: ${path}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActions.map((action, index) => (
        <Link
          key={index}
          to={action.path}
          onClick={() => handleQuickAction(action.path)}
          className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-1"
        >
          {/* Badge */}
          {action.badge && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-medium">
              {action.badge}
            </div>
          )}

          {/* Icon */}
          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
            <Icon name={action.icon} size={24} color={action.iconColor} />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {action.description}
            </p>
          </div>

          {/* Arrow Icon */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardQuickActions;