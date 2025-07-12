import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ type, onCreateRequest }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'pending':
        return {
          icon: 'Clock',
          title: 'No Pending Requests',
          description: 'You don\'t have any pending skill exchange requests at the moment.',
          actionText: 'Browse Skills',
          actionPath: '/skill-browser-search'
        };
      case 'accepted':
        return {
          icon: 'CheckCircle',
          title: 'No Active Swaps',
          description: 'You don\'t have any accepted skill exchanges in progress.',
          actionText: 'Find Skills to Learn',
          actionPath: '/skill-browser-search'
        };
      case 'history':
        return {
          icon: 'History',
          title: 'No Swap History',
          description: 'You haven\'t completed any skill exchanges yet. Start your first swap!',
          actionText: 'Start Learning',
          actionPath: '/skill-browser-search'
        };
      case 'completed':
        return {
          icon: 'CheckCircle',
          title: 'No Completed Swaps',
          description: 'You haven\'t completed any skill exchanges yet. Complete your first swap!',
          actionText: 'View Active Swaps',
          actionPath: null
        };
      default:
        return {
          icon: 'ArrowLeftRight',
          title: 'No Swaps Found',
          description: 'No skill exchanges match your current filters.',
          actionText: 'Clear Filters',
          actionPath: null
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
        <Icon name={content.icon} size={40} className="text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {content.actionPath ? (
          <Link to={content.actionPath}>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              {content.actionText}
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
            onClick={onCreateRequest}
          >
            {content.actionText}
          </Button>
        )}
        
        <Link to="/user-dashboard">
          <Button variant="ghost">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;