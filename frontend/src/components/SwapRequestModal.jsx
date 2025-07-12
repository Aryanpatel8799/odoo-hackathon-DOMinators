import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Icon from './AppIcon';
import { useToast } from '../context/ToastContext';

const SwapRequestModal = ({ isOpen, onClose, targetUser, onSwapCreated, currentUserSkills }) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    offeredSkill: '',
    wantedSkill: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);

  useEffect(() => {
    if (isOpen && targetUser) {
      // Extract skills from target user (try skills, skillsOffered, skillsWanted)
      let theirSkills = [];
      if (targetUser.skills && Array.isArray(targetUser.skills)) {
        theirSkills = targetUser.skills.map(skill => typeof skill === 'string' ? skill : skill.name);
      } else if (targetUser.skillsOffered && Array.isArray(targetUser.skillsOffered)) {
        theirSkills = targetUser.skillsOffered.map(skill => typeof skill === 'string' ? skill : skill.name);
      } else if (targetUser.skillsWanted && Array.isArray(targetUser.skillsWanted)) {
        theirSkills = targetUser.skillsWanted.map(skill => typeof skill === 'string' ? skill : skill.name);
      }
      setWantedSkills(theirSkills);

      // Extract skills from current user (try all possible properties)
      let mySkills = [];
      if (currentUserSkills && Array.isArray(currentUserSkills)) {
        mySkills = currentUserSkills.map(skill => typeof skill === 'string' ? skill : skill.name);
      } else if (currentUserSkills?.skillsOffered && Array.isArray(currentUserSkills.skillsOffered)) {
        mySkills = currentUserSkills.skillsOffered.map(skill => typeof skill === 'string' ? skill : skill.name);
      } else if (currentUserSkills?.skills && Array.isArray(currentUserSkills.skills)) {
        mySkills = currentUserSkills.skills.map(skill => typeof skill === 'string' ? skill : skill.name);
      }
      console.log('SwapRequestModal: currentUserSkills', currentUserSkills, 'mySkills', mySkills);
      setOfferedSkills(mySkills);

      // Reset form
      setFormData({
        offeredSkill: '',
        wantedSkill: '',
        message: '',
      });
      setErrors({});
    }
  }, [isOpen, targetUser, currentUserSkills]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.offeredSkill.trim()) {
      newErrors.offeredSkill = 'Please select a skill you can offer';
    }

    if (!formData.wantedSkill.trim()) {
      newErrors.wantedSkill = 'Please select a skill you want to learn';
    }

    if (formData.offeredSkill === formData.wantedSkill) {
      newErrors.wantedSkill = 'Offered and wanted skills cannot be the same';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const swapService = (await import('../services/swapService')).default;
      
      const response = await swapService.createSwap(
        targetUser._id,
        formData.offeredSkill,
        formData.wantedSkill
      );

      if (onSwapCreated) {
        onSwapCreated(response.data);
      }
      
      showSuccess('Swap request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating swap:', error);
      setErrors({ submit: error.message });
      showError(error.message || 'Failed to create swap request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Request Skill Swap
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {targetUser && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={targetUser.profileIMG || targetUser.avatar}
                alt={targetUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-foreground">{targetUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {targetUser.location || 'Location not specified'}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Skill I can offer
            </label>
            <Select
              value={formData.offeredSkill}
              onChange={(value) => handleInputChange('offeredSkill', value)}
              placeholder="Select a skill you can teach"
              error={errors.offeredSkill}
              options={offeredSkills.map(skill => ({
                value: skill,
                label: skill
              }))}
            />
            {errors.offeredSkill && (
              <p className="text-sm text-destructive mt-1">{errors.offeredSkill}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Skill I want to learn
            </label>
            <Select
              value={formData.wantedSkill}
              onChange={(value) => handleInputChange('wantedSkill', value)}
              placeholder="Select a skill you want to learn"
              error={errors.wantedSkill}
              options={wantedSkills.map(skill => ({
                value: skill,
                label: skill
              }))}
            />
            {errors.wantedSkill && (
              <p className="text-sm text-destructive mt-1">{errors.wantedSkill}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Add a personal message to your request..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Send Request'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal; 