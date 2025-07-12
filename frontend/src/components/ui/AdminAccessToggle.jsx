import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from './Button';

const AdminAccessToggle = ({ userPermissions = { isAdmin: true } }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnAdminPanel = location.pathname.startsWith('/admin-panel');

  const toggleAdminMode = () => {
    if (isOnAdminPanel) {
      // If currently on admin panel, navigate back to dashboard
      navigate('/user-dashboard');
      setIsAdminMode(false);
    } else {
      // If not on admin panel, navigate to admin dashboard
      navigate('/admin-panel-dashboard');
      setIsAdminMode(true);
    }
  };

  // Don't render if user doesn't have admin permissions
  if (!userPermissions.isAdmin) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Admin Mode Indicator */}
      {isOnAdminPanel && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-md">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span className="text-xs font-medium text-secondary">Admin Mode</span>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        variant={isOnAdminPanel ? "secondary" : "outline"}
        size="sm"
        onClick={toggleAdminMode}
        iconName={isOnAdminPanel ? "User" : "Shield"}
        iconPosition="left"
        iconSize={16}
        className="transition-all duration-200"
      >
        {isOnAdminPanel ? 'Exit Admin' : 'Admin Panel'}
      </Button>
    </div>
  );
};

export default AdminAccessToggle;