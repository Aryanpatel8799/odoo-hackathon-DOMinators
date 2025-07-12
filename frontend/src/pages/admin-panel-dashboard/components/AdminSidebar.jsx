import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminNavItems = [
    {
      label: 'Dashboard',
      path: '/admin-panel-dashboard',
      icon: 'LayoutDashboard',
      badge: null
    },
    {
      label: 'User Management',
      path: '/admin-panel-dashboard',
      icon: 'Users',
      badge: 12
    },
    {
      label: 'Swap Management',
      path: '/admin-swap-management',
      icon: 'ArrowLeftRight',
      badge: 5
    },
    {
      label: 'Analytics',
      path: '/admin-analytics',
      icon: 'BarChart3',
      badge: null
    },
    {
      label: 'Settings',
      path: '/admin-settings',
      icon: 'Settings',
      badge: null
    }
  ];

  const userNavItems = [
    {
      label: 'User Dashboard',
      path: '/user-dashboard',
      icon: 'Home',
      badge: null
    },
    {
      label: 'Browse Skills',
      path: '/skill-browser-search',
      icon: 'Search',
      badge: null
    },
    {
      label: 'My Profile',
      path: '/user-profile-management',
      icon: 'User',
      badge: null
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-out bg-card border-r border-border`}>
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/admin-panel-dashboard" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-lg">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">Admin Panel</span>
            </Link>
          )}
          
          {isCollapsed && (
            <Link to="/admin-panel-dashboard" className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-lg">
                <Icon name="Shield" size={20} color="white" />
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

        {/* Admin Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin Tools
              </h3>
            )}
          </div>

          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted ${
                isActiveRoute(item.path)
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
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
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}

          {/* User Navigation Separator */}
          <div className="pt-6 mt-6 border-t border-border">
            {!isCollapsed && (
              <h3 className="px-3 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                User Portal
              </h3>
            )}

            {userNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted ${
                  isActiveRoute(item.path)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={`${isCollapsed ? 'mx-auto' : 'mr-3'} transition-colors duration-200`}
                />
                {!isCollapsed && <span className="flex-1">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Admin Profile Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="UserCheck" size={20} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">Platform Administrator</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;