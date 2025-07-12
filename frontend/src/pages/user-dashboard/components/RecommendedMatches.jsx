import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecommendedMatches = () => {
  const recommendedUsers = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      rating: 4.9,
      reviewCount: 127,
      offeredSkills: ['Python', 'Data Science', 'Machine Learning'],
      wantedSkills: ['React', 'Frontend Development'],
      matchPercentage: 95,
      isOnline: true,
      lastActive: 'Active now'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      rating: 4.8,
      reviewCount: 89,
      offeredSkills: ['UI/UX Design', 'Figma', 'Prototyping'],
      wantedSkills: ['JavaScript', 'Node.js'],
      matchPercentage: 88,
      isOnline: false,
      lastActive: '2 hours ago'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Austin, TX',
      rating: 4.7,
      reviewCount: 156,
      offeredSkills: ['Photography', 'Photo Editing', 'Lightroom'],
      wantedSkills: ['Web Development', 'CSS'],
      matchPercentage: 82,
      isOnline: true,
      lastActive: 'Active now'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      rating: 4.9,
      reviewCount: 203,
      offeredSkills: ['Digital Marketing', 'SEO', 'Content Strategy'],
      wantedSkills: ['Graphic Design', 'Branding'],
      matchPercentage: 79,
      isOnline: false,
      lastActive: '1 day ago'
    }
  ];

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recommended Matches</h3>
            <p className="text-sm text-muted-foreground mt-1">
              People who might be perfect skill exchange partners
            </p>
          </div>
          <Link
            to="/skill-browser-search"
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedUsers.map((user) => (
            <div
              key={user.id}
              className="border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200 hover:-translate-y-1"
            >
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{user.name}</h4>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Icon name="MapPin" size={12} />
                      <span>{user.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm font-medium ${getMatchColor(user.matchPercentage)}`}>
                  {user.matchPercentage}% match
                </div>
              </div>

              {/* Rating and Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm font-medium text-foreground">{user.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({user.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{user.lastActive}</span>
              </div>

              {/* Skills */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Offers:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.offeredSkills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-success/10 text-success rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.offeredSkills.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{user.offeredSkills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Wants:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.wantedSkills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.wantedSkills.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{user.wantedSkills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  iconName="ArrowLeftRight"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Request Swap
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageSquare"
                  iconSize={14}
                >
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedMatches;