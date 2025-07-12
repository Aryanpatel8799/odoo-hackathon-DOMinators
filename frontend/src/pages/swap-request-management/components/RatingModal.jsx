import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RatingModal = ({ isOpen, onClose, swap, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmitRating({
        swapId: swap.id,
        rating,
        feedback: feedback.trim()
      });
      onClose();
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (ratingValue) => {
    switch (ratingValue) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select a rating';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Rate Your Experience</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Swap Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div>
                <p className="font-medium text-foreground">{swap?.participant?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {swap?.theirSkill} ↔ {swap?.yourSkill}
                </p>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              How was your experience?
            </label>
            <div className="flex items-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 transition-transform duration-150 hover:scale-110"
                >
                  <Icon
                    name="Star"
                    size={32}
                    className={`transition-colors duration-150 ${
                      star <= (hoveredRating || rating)
                        ? 'text-warning fill-current' :'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {getRatingText(hoveredRating || rating)}
            </p>
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <Input
              label="Feedback (Optional)"
              type="text"
              placeholder="Share your thoughts about this skill exchange..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              description="Help others by sharing your experience"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={rating === 0 || isSubmitting}
              loading={isSubmitting}
              fullWidth
            >
              Submit Rating
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;