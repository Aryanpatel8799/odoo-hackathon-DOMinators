import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SwapRequestCard = ({ swap, onAccept, onReject, onCounterOffer, onMessage, onComplete, onRate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'accepted':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={swap.participant.avatar}
              alt={swap.participant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {swap.participant.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-card rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{swap.participant.name}</h3>
            <p className="text-sm text-muted-foreground">{swap.participant.location}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(swap.status)}`}>
            {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
          </span>
          {swap.direction === 'incoming' && swap.status === 'pending' && (
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Skills Exchange */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">You offer</p>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {swap.yourSkill}
              </span>
              <span className="text-xs text-muted-foreground">
                {swap.yourLevel}
              </span>
            </div>
          </div>
          
          <div className="mx-4">
            <Icon name="ArrowLeftRight" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="flex-1 text-right">
            <p className="text-sm text-muted-foreground mb-1">You learn</p>
            <div className="flex items-center justify-end space-x-2">
              <span className="text-xs text-muted-foreground">
                {swap.theirLevel}
              </span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                {swap.theirSkill}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Proposed Time */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Proposed Time</p>
            <p className="text-sm text-muted-foreground">{formatDate(swap.proposedTime)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Duration</p>
            <p className="text-sm text-muted-foreground">{swap.duration}</p>
          </div>
        </div>
      </div>

      {/* Message Preview */}
      {swap.message && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Message</p>
          <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
            {isExpanded ? swap.message : `${swap.message.substring(0, 100)}${swap.message.length > 100 ? '...' : ''}`}
          </p>
          {swap.message.length > 100 && (
            <button
              onClick={toggleExpanded}
              className="text-xs text-primary hover:underline mt-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageSquare"
            iconPosition="left"
            iconSize={16}
            onClick={() => onMessage(swap.id)}
          >
            Message
          </Button>
          
          {swap.status === 'accepted' && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Calendar"
              iconPosition="left"
              iconSize={16}
            >
              Reschedule
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {swap.status === 'pending' && swap.direction === 'incoming' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(swap.id)}
              >
                Reject
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCounterOffer(swap.id)}
              >
                Counter
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onAccept(swap.id)}
              >
                Accept
              </Button>
            </>
          )}

          {swap.status === 'accepted' && (
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              iconPosition="left"
              iconSize={16}
              onClick={() => onComplete(swap.id)}
            >
              Mark Complete
            </Button>
          )}

          {swap.status === 'completed' && !swap.rated && (
            <Button
              variant="outline"
              size="sm"
              iconName="Star"
              iconPosition="left"
              iconSize={16}
              onClick={() => onRate(swap.id)}
            >
              Rate
            </Button>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {swap.direction === 'incoming' ? 'Received' : 'Sent'} {formatDate(swap.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default SwapRequestCard;