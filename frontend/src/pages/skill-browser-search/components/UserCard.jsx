import React, { useState, useMemo, useContext } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import SwapRequestModal from '../../../components/SwapRequestModal';
import { useToast } from '../../../context/ToastContext';
import { UserDataContext } from '../../../context/UserContext';

const UserCard = ({ user, viewMode = 'grid' }) => {
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();
  const { user: currentUser } = useContext(UserDataContext);
  // Defensive: always define currentUserSkills
  const currentUserSkills = currentUser?.skillsOffered || currentUser?.skills || [];

  // Defensive: always use arrays
  const safeSkills = Array.isArray(user.skills) ? user.skills : [];
  const { offeredSkills, wantedSkills, totalSkills } = useMemo(() => {
    const offered = safeSkills.filter(skill => (skill.type === 'offered' || skill.level === 'intermediate' || skill.level === 'advanced' || skill.level === 'expert'));
    const wanted = safeSkills.filter(skill => (skill.type === 'wanted' || skill.level === 'beginner'));
    console.log('UserCard skills processing:', {
      user: user.name,
      safeSkills,
      offered,
      wanted
    });
    return {
      offeredSkills: offered,
      wantedSkills: wanted,
      totalSkills: safeSkills.length
    };
  }, [safeSkills]);

  // Defensive: fallback values
  const userName = user.name || 'Unknown';
  const userAvatar = user.avatar || '';
  const userLocation = user.location || 'Location not specified';
  const userAvailability = user.availability || 'unknown';
  const userRating = typeof user.rating === 'number' ? user.rating : 0;
  const userReviewCount = typeof user.reviewCount === 'number' ? user.reviewCount : 0;
  const userVerified = !!user.verified;
  const userLastActive = user.lastActive || null;

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
    setIsSwapModalOpen(true);
  };

  const handleSwapCreated = (newSwap) => {
    console.log('Swap created:', newSwap);
    showSuccess('Swap request sent successfully!');
  };

  const getSkillLevelDots = (level) => {
    const levels = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };
    return '●'.repeat(levels[level] || 1);
  };

  const formatLastActive = (lastActive) => {
    if (!lastActive) return 'Unknown';
    const now = new Date();
    const last = new Date(lastActive);
    const diffInHours = (now - last) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
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
    <>
      <div className="bg-white border border-border rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-2 transition-all duration-200 group relative min-h-[420px] flex flex-col items-center p-8 text-center">
        {/* Profile Image */}
        <div className="relative w-28 h-28 mb-4 mx-auto">
          <Image
            src={userAvatar}
            alt={userName}
            className="w-full h-full rounded-full object-cover ring-4 ring-primary/30 group-hover:ring-primary shadow-lg transition-all"
          />
          {user.isOnline && (
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-success border-2 border-white rounded-full shadow" />
          )}
        </div>
        {/* Name & Verification */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-2xl font-extrabold text-foreground truncate max-w-[180px]">{userName}</h3>
          {userVerified && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-primary text-white rounded-full ml-1">
              <Icon name="BadgeCheck" size={16} className="mr-1" /> Verified
            </span>
          )}
        </div>
        {/* Location & Last Active */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
          <Icon name="MapPin" size={15} />
          <span className="truncate max-w-[120px]">{userLocation}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
          <Icon name="Clock" size={13} />
          <span>{formatLastActive(userLastActive)}</span>
        </div>
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {renderStars(userRating)}
          <span className="text-xs text-muted-foreground ml-1">({userReviewCount})</span>
        </div>
        {/* Skills Section */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-semibold text-foreground">Skills</span>
            <span className="text-xs text-muted-foreground">{totalSkills} total</span>
          </div>
          {/* Offered Skills */}
          <div className="mb-2">
            <div className="flex items-center gap-1 mb-1">
              <Icon name="ArrowUp" size={14} className="text-success" />
              <span className="text-xs font-semibold text-success uppercase tracking-wide">Offering</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {offeredSkills.length > 0 ? (
                offeredSkills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 text-xs bg-success/10 text-success rounded-full border border-success/20 font-semibold shadow-sm"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs opacity-75">{getSkillLevelDots(skill.level)}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No skills offered</span>
              )}
              {offeredSkills.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                  +{offeredSkills.length - 3}
                </span>
              )}
            </div>
          </div>
          {/* Wanted Skills */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Icon name="ArrowDown" size={14} className="text-warning" />
              <span className="text-xs font-semibold text-warning uppercase tracking-wide">Learning</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {wantedSkills.length > 0 ? (
                wantedSkills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 font-semibold shadow-sm"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs opacity-75">{getSkillLevelDots(skill.level)}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No skills wanted</span>
              )}
              {wantedSkills.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                  +{wantedSkills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-auto">
          <Button
            variant="default"
            size="lg"
            onClick={handleSwapRequestClick}
            iconName="ArrowLeftRight"
            iconPosition="left"
            fullWidth
            className="font-bold text-base group-hover:bg-primary/90 transition-colors py-3 rounded-xl shadow-md"
          >
            Request Swap
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleMessageClick}
            iconName="MessageSquare"
            iconPosition="left"
            fullWidth
            className="group-hover:border-primary/20 group-hover:text-primary transition-colors py-3 rounded-xl"
          >
            Send Message
          </Button>
        </div>
        <SwapRequestModal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          targetUser={user}
          onSwapCreated={handleSwapCreated}
          currentUserSkills={currentUserSkills}
        />
      </div>
    </>
  );
};

export default UserCard;