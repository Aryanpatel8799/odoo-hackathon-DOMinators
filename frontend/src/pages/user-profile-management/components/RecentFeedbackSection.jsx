import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentFeedbackSection = ({ recentFeedback, averageRating }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Feedback</h3>
        
        {/* Average Rating Display */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="Star"
                size={16}
                className={star <= Math.round(averageRating) ? 'text-accent fill-current' : 'text-muted-foreground'}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">{averageRating}</span>
          <span className="text-sm text-muted-foreground">avg</span>
        </div>
      </div>

      {recentFeedback.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No feedback yet</p>
          <p className="text-sm text-muted-foreground">
            Complete your first skill swap to receive feedback
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentFeedback.map((feedback) => (
            <div key={feedback.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                {/* Reviewer Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {feedback.reviewer.avatar ? (
                    <Image
                      src={feedback.reviewer.avatar}
                      alt={feedback.reviewer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary">
                      <Icon name="User" size={16} color="white" />
                    </div>
                  )}
                </div>

                {/* Feedback Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{feedback.reviewer.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Skill swap: {feedback.skillExchanged}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            name="Star"
                            size={14}
                            className={star <= feedback.rating ? 'text-accent fill-current' : 'text-muted-foreground'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(feedback.date)}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-sm text-foreground leading-relaxed">
                    "{feedback.comment}"
                  </p>

                  {/* Feedback Tags */}
                  {feedback.tags && feedback.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {feedback.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* View All Feedback Link */}
          {recentFeedback.length >= 3 && (
            <div className="text-center pt-4">
              <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                View all feedback →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentFeedbackSection;