import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            iconName="Menu"
            iconSize={20}
          >
            <span className="sr-only">Open menu</span>
          </Button>
        </div>

        {/* Logo */}
        <Link to="/user-dashboard" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="ArrowLeftRight" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">SkillSwap</span>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link 
            to="/skill-browser-search" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Browse Skills
          </Link>
          <Link 
            to="/swap-request-management" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            My Swaps
          </Link>
          <Link 
            to="/messaging-system" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Messages
          </Link>
        </nav>

        {/* Authentication Buttons */}
        <div className="flex items-center space-x-3">
          {/* Sign In Button */}
          <Link  to="/o-auth-sign-in">
          <button className="hidden sm:inline-flex items-center px-4 py-2 rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-medium">
            Sign In
          </button>
          </Link>
          
          {/* Sign Up Button */}
           <Link  to="/o-auth-sign-up">
          <button className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-medium">
            Sign Up
          </button>
           </Link>

          {/* Mobile Authentication Menu */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-blue-600"
            >
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-40">
          <nav className="px-6 py-4 space-y-4">
            <Link
              to="/user-dashboard"
              className="flex items-center space-x-3 py-3 text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="LayoutDashboard" size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              to="/skill-browser-search"
              className="flex items-center space-x-3 py-3 text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="Search" size={20} />
              <span className="font-medium">Browse Skills</span>
            </Link>
            
            <Link
              to="/swap-request-management"
              className="flex items-center space-x-3 py-3 text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="ArrowLeftRight" size={20} />
              <span className="font-medium">My Swaps</span>
            </Link>
            
            <Link
              to="/messaging-system"
              className="flex items-center space-x-3 py-3 text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="MessageSquare" size={20} />
              <span className="font-medium">Messages</span>
            </Link>

            {/* Mobile Authentication Buttons */}
            <div className="border-t border-border pt-4 space-y-3">
              <button 
                className="flex items-center justify-center w-full px-4 py-3 rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300 ease-in-out font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </button>
              
              <button 
                className="flex items-center justify-center w-full px-4 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ease-in-out font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;