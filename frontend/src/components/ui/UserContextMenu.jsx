import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { UserDataContext } from '../../context/UserContext';

const UserContextMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);
  const { user, setUser } = useContext(UserDataContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Theme toggle logic would go here
    document.documentElement.classList.toggle('dark');
    closeMenu();
  };

  const handleLogout = () => {
    // Clear user data from context and localStorage
    setUser({
      googleID: '',
      email: '',
      name: '',
      profileIMG: ''
    });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token"); // Remove old token format if exists
    closeMenu();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render if no user data
  if (!user || !user.email) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="flex items-center space-x-2 hover:bg-muted"
      >
        {user.profileIMG ? (
          <img 
            src={user.profileIMG} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-foreground">{user.name || 'User'}</p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 animate-fade-in">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              {user.profileIMG ? (
                <img 
                  src={user.profileIMG} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="w-2 h-2 bg-success rounded-full" title="Online" />
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/user-profile-management"
              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              onClick={closeMenu}
            >
              <Icon name="User" size={16} className="mr-3" />
              Profile Settings
            </Link>

            <Link
              to="/user-dashboard"
              className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              onClick={closeMenu}
            >
              <Icon name="LayoutDashboard" size={16} className="mr-3" />
              Dashboard
            </Link>

            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
            >
              <Icon name={isDarkMode ? "Sun" : "Moon"} size={16} className="mr-3" />
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Admin Panel Access - Conditional */}
            {user.isAdmin && (
              <>
                <div className="border-t border-border my-2" />
                <Link
                  to="/admin-panel-dashboard"
                  className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-muted transition-colors duration-150"
                  onClick={closeMenu}
                >
                  <Icon name="Shield" size={16} className="mr-3" />
                  Admin Panel
                  <span className="ml-auto text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                    Admin
                  </span>
                </Link>
              </>
            )}

            {/* Settings and Help */}
            <div className="border-t border-border my-2" />
            
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              onClick={closeMenu}
            >
              <Icon name="Settings" size={16} className="mr-3" />
              Settings
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              onClick={closeMenu}
            >
              <Icon name="HelpCircle" size={16} className="mr-3" />
              Help & Support
            </button>

            {/* Logout */}
            <div className="border-t border-border my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors duration-150"
            >
              <Icon name="LogOut" size={16} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContextMenu;