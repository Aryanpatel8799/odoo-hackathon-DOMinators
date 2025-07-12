import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onProfileUpdate(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Keep editing mode on error so user can retry
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      
      // Create a File object for the backend
      const imageFile = new File([file], file.name, { type: file.type });
      
      // Update the profile with the file
      handleInputChange('avatar', imageFile);
      
      // Also create a preview URL for immediate display
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProfile(prev => ({
          ...prev,
          avatarPreview: e.target.result
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAvailability = () => {
    handleInputChange('isAvailable', !editedProfile.isAvailable);
  };

  const toggleProfileVisibility = () => {
    handleInputChange('isPublic', !editedProfile.isPublic);
  };

  // Get the avatar URL to display (preview or original)
  const getAvatarUrl = () => {
    if (isEditing && editedProfile.avatarPreview) {
      return editedProfile.avatarPreview;
    }
    return editedProfile.avatar;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
              {getAvatarUrl() ? (
                <Image
                  src={getAvatarUrl()}
                  alt={editedProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary">
                  <Icon name="User" size={48} color="white" />
                </div>
              )}
            </div>
            
            {/* Upload Button */}
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {isUploading ? (
                  <Icon name="Loader2" size={20} color="white" className="animate-spin" />
                ) : (
                  <Icon name="Camera" size={20} color="white" />
                )}
              </label>
            )}

            {/* Availability Status */}
            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-background ${
              editedProfile.isAvailable ? 'bg-success' : 'bg-muted-foreground'
            }`} title={editedProfile.isAvailable ? 'Available' : 'Unavailable'} />
          </div>

          {/* Mobile Edit Button */}
          <div className="mt-4 lg:hidden">
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={handleEdit} iconName="Edit" iconPosition="left">
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex-1 space-y-4">
          {/* Name and Location */}
          <div className="space-y-3">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-2xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none w-full"
                  placeholder="Your name"
                />
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="text-muted-foreground bg-transparent border-b border-border focus:border-primary outline-none w-full"
                  placeholder="Your location"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-foreground">{editedProfile.name}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Icon name="MapPin" size={16} className="mr-1" />
                  <span>{editedProfile.location || 'Location not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name="Star"
                    size={16}
                    className={star <= editedProfile.rating ? 'text-accent fill-current' : 'text-muted-foreground'}
                  />
                ))}
              </div>
              <span className="text-foreground font-medium">{editedProfile.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({editedProfile.reviewCount} reviews)</span>
            </div>
            <div className="text-muted-foreground">
              {editedProfile.completedSwaps} swaps completed
            </div>
          </div>

          {/* Status Toggles */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Availability Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Available for swaps:</span>
              <button
                onClick={isEditing ? toggleAvailability : undefined}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  editedProfile.isAvailable ? 'bg-success' : 'bg-muted-foreground'
                } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    editedProfile.isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Profile Visibility Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Public profile:</span>
              <button
                onClick={isEditing ? toggleProfileVisibility : undefined}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  editedProfile.isPublic ? 'bg-primary' : 'bg-muted-foreground'
                } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    editedProfile.isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Desktop Edit Button */}
          <div className="hidden lg:block">
            {!isEditing ? (
              <Button variant="outline" onClick={handleEdit} iconName="Edit" iconPosition="left">
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;