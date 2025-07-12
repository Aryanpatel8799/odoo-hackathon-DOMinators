import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AboutSection = ({ about, onAboutUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedAbout(about);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onAboutUpdate(editedAbout);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving about section:', error);
      // Keep editing mode on error so user can retry
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedAbout(about);
    setIsEditing(false);
  };

  const handleTextChange = (e) => {
    setEditedAbout(e.target.value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">About Me</h3>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            iconName="Edit"
            iconSize={16}
          >
            Edit
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

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedAbout}
            onChange={handleTextChange}
            placeholder="Tell others about yourself, your interests, and what you're passionate about..."
            className="w-full h-32 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            maxLength={500}
            disabled={isSaving}
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Share your story and what makes you unique</span>
            <span>{editedAbout.length}/500</span>
          </div>
        </div>
      ) : (
        <div>
          {about ? (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {about}
            </p>
          ) : (
            <div className="text-center py-8">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">No description yet</p>
              <p className="text-sm text-muted-foreground">
                Add a description to tell others about yourself
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutSection;