import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/user-dashboard',
      icon: 'LayoutDashboard',
      badge: null,
      tooltip: 'View your activity overview and quick actions'
    },
    {
      label: 'Browse Skills',
      path: '/skill-browser-search',
      icon: 'Search',
      badge: null,
      tooltip: 'Discover and search for skills to learn'
    },
    {
      label: 'My Swaps',
      path: '/swap-request-management',
      icon: 'ArrowLeftRight',
      badge: 3,
      tooltip: 'Manage your skill exchange requests'
    },
    {
      label: 'Messages',
      path: '/messaging-system',
      icon: 'MessageSquare',
      badge: 2,
      tooltip: 'Chat with your skill exchange partners'
    },
    {
      label: 'Profile',
      path: '/user-profile-management',
      icon: 'User',
      badge: null,
      tooltip: 'Manage your profile and skills'
    }
  ];

  const adminItem = {
    label: 'Admin Panel',
    path: '/admin-panel-dashboard',
    icon: 'Shield',
    badge: null,
    tooltip: 'Access administrative functions'
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block ${isCollapsed ? 'lg:w-16' : 'lg:w-60'} transition-all duration-300 ease-out-custom`}>
        <div className="flex h-full flex-col bg-card border-r border-border">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {!isCollapsed && (
              <Link to="/user-dashboard" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="ArrowLeftRight" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-foreground">SkillSwap</span>
              </Link>
            )}
            
            {isCollapsed && (
              <Link to="/user-dashboard" className="flex items-center justify-center w-full">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="ArrowLeftRight" size={20} color="white" />
                </div>
              </Link>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-muted transition-colors duration-150"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted ${
                  isActiveRoute(item.path)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={isCollapsed ? item.tooltip : ''}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={`${isCollapsed ? 'mx-auto' : 'mr-3'} transition-colors duration-200`}
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}

            {/* Admin Panel Separator */}
            <div className="pt-6 mt-6 border-t border-border">
              <Link
                to={adminItem.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted ${
                  isActiveRoute(adminItem.path)
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={isCollapsed ? adminItem.tooltip : ''}
              >
                <Icon 
                  name={adminItem.icon} 
                  size={20} 
                  className={`${isCollapsed ? 'mx-auto' : 'mr-3'} transition-colors duration-200`}
                />
                {!isCollapsed && <span className="flex-1">{adminItem.label}</span>}
              </Link>
            </div>
          </nav>

          {/* User Profile Section */}
          {!isCollapsed && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">Skill Enthusiast</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Spacer */}
      <div className={`hidden lg:block ${isCollapsed ? 'lg:w-16' : 'lg:w-60'} transition-all duration-300 ease-out-custom`} />
    </>
  );
};

export default Sidebar;