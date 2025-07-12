import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SwapHistorySection = ({ swapHistory }) => {
  const [selectedSwap, setSelectedSwap] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSwapClick = (swap) => {
    setSelectedSwap(selectedSwap?.id === swap.id ? null : swap);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Swap History</h3>
        <span className="text-sm text-muted-foreground">
          {swapHistory.length} total swaps
        </span>
      </div>

      {swapHistory.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No swap history yet</p>
          <p className="text-sm text-muted-foreground">
            Your completed skill exchanges will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {swapHistory.map((swap) => (
            <div key={swap.id} className="border border-border rounded-lg overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => handleSwapClick(swap)}
              >
                <div className="flex items-start gap-4">
                  {/* Partner Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {swap.partner.avatar ? (
                      <Image
                        src={swap.partner.avatar}
                        alt={swap.partner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary">
                        <Icon name="User" size={20} color="white" />
                      </div>
                    )}
                  </div>

                  {/* Swap Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {swap.skillOffered} ↔ {swap.skillReceived}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          with {swap.partner.name}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(swap.status)}`}>
                          {swap.status}
                        </span>
                        <Icon 
                          name={selectedSwap?.id === swap.id ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{formatDate(swap.completedDate)}</span>
                      {swap.rating && (
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={14} className="text-accent fill-current" />
                          <span>{swap.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedSwap?.id === swap.id && (
                <div className="border-t border-border p-4 bg-muted/30">
                  <div className="space-y-4">
                    {/* Feedback */}
                    {swap.feedback && (
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Feedback Received:</h5>
                        <p className="text-sm text-muted-foreground italic">
                          "{swap.feedback}"
                        </p>
                      </div>
                    )}

                    {/* Session Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Duration:</span>
                        <span className="text-muted-foreground ml-2">{swap.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Format:</span>
                        <span className="text-muted-foreground ml-2">{swap.format}</span>
                      </div>
                    </div>

                    {/* Partner Rating */}
                    {swap.partnerRating && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Your rating for {swap.partner.name}:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              key={star}
                              name="Star"
                              size={14}
                              className={star <= swap.partnerRating ? 'text-accent fill-current' : 'text-muted-foreground'}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapHistorySection;