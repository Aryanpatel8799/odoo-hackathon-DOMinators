import React from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserCard = ({ user, viewMode = 'grid' }) => {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'away': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getAvailabilityText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'away': return 'Away';
      default: return 'Unknown';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name={index < Math.floor(rating) ? "Star" : "Star"}
        size={14}
        className={index < Math.floor(rating) ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  const handleMessageClick = (e) => {
    e.preventDefault();
    console.log(`Starting conversation with ${user.name}`);
  };

  const handleSwapRequestClick = (e) => {
    e.preventDefault();
    console.log(`Sending swap request to ${user.name}`);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-all duration-200">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Image
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getAvailabilityColor(user.availability)} rounded-full border-2 border-card`} />
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground truncate">{user.name}</h3>
              {user.verified && (
                <Icon name="BadgeCheck" size={16} className="text-primary" />
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${getAvailabilityColor(user.availability)}`} />
                <span>{getAvailabilityText(user.availability)}</span>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(user.rating)}
                <span className="ml-1">({user.reviewCount})</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {user.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                >
                  {skill.name}
                  <span className="ml-1 text-xs opacity-75">
                    {skill.level === 'beginner' ? '●' : skill.level === 'intermediate' ? '●●' : '●●●'}
                  </span>
                </span>
              ))}
              {user.skills.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                  +{user.skills.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMessageClick}
              iconName="MessageSquare"
              iconPosition="left"
            >
              Message
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSwapRequestClick}
              iconName="ArrowLeftRight"
              iconPosition="left"
            >
              Swap
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-1">
      {/* Avatar Section */}
      <div className="relative p-6 pb-4">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getAvailabilityColor(user.availability)} rounded-full border-2 border-card`} />
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
            {user.verified && (
              <Icon name="BadgeCheck" size={16} className="text-primary" />
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-2">
            <Icon name="MapPin" size={14} />
            <span>{user.location}</span>
          </div>

          <div className="flex items-center justify-center space-x-1 mb-3">
            {renderStars(user.rating)}
            <span className="text-sm text-muted-foreground ml-1">({user.reviewCount})</span>
          </div>

          <div className="flex items-center justify-center space-x-1 text-sm">
            <span className={`w-2 h-2 rounded-full ${getAvailabilityColor(user.availability)}`} />
            <span className="text-muted-foreground">{getAvailabilityText(user.availability)}</span>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-6 pb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Featured Skills</h4>
        <div className="flex flex-wrap gap-1">
          {user.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
            >
              {skill.name}
              <span className="ml-1 text-xs opacity-75">
                {skill.level === 'beginner' ? '●' : skill.level === 'intermediate' ? '●●' : '●●●'}
              </span>
            </span>
          ))}
          {user.skills.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
              +{user.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 space-y-2">
        <Button
          variant="default"
          size="sm"
          onClick={handleSwapRequestClick}
          iconName="ArrowLeftRight"
          iconPosition="left"
          fullWidth
        >
          Request Swap
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMessageClick}
          iconName="MessageSquare"
          iconPosition="left"
          fullWidth
        >
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default UserCard;