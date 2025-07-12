import React, { useState, useEffect, useContext, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ProfileHeader from './components/ProfileHeader';
import SkillsSection from './components/SkillsSection';
import AboutSection from './components/AboutSection';
import SwapHistorySection from './components/SwapHistorySection';
import RecentFeedbackSection from './components/RecentFeedbackSection';
import { UserDataContext } from '../../context/UserContext';
import userService from '../../services/userService';

const UserProfileManagement = () => {
  const { user, setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  
  const [profile, setProfile] = useState({
    id: 1,
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    location: "",
    avatar: user?.profileIMG || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    isAvailable: true,
    isPublic: true,
    rating: 0,
    reviewCount: 0,
    completedSwaps: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  });

  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [about, setAbout] = useState('');
  const [availability, setAvailability] = useState([]);

  const [swapHistory] = useState([]);
  const [recentFeedback] = useState([]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Check backend status
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const isConnected = await userService.testBackendConnection();
        setBackendStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Error checking backend status:', error);
        setBackendStatus('disconnected');
      }
    };

    checkBackendStatus();
  }, []);

  // Initialize profile with real user data from Google login
  useEffect(() => {
    if (user && user.email) {
      setProfile(prevProfile => ({
        ...prevProfile,
        name: user.name || "User",
        email: user.email || "user@example.com",
        avatar: user.profileIMG || prevProfile.avatar,
        joinedDate: new Date().toISOString().split('T')[0]
      }));
      setDataLoaded(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchUserProfile = useCallback(async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getUserProfile();
      
      if (response.success) {
        const userData = response.data;
        
        // Update profile with real data from backend
        setProfile(prevProfile => ({
          ...prevProfile,
          name: userData.name || user?.name || "User",
          email: userData.email || user?.email || "user@example.com",
          location: userData.location || "",
          avatar: userData.profileIMG || user?.profileIMG || prevProfile.avatar,
          isPublic: userData.isPublic !== undefined ? userData.isPublic : true,
          rating: userData.stats?.averageRating || 0,
          reviewCount: userData.stats?.reviewCount || 0,
          completedSwaps: userData.stats?.completedSwaps || 0,
          joinedDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : prevProfile.joinedDate
        }));

        // Update skills
        setSkillsOffered(userData.skillsOffered || []);
        setSkillsWanted(userData.skillsWanted || []);
        
        // Update about section
        setAbout(userData.about || '');
        
        // Update availability
        setAvailability(userData.availability || []);

        // Update user context with fresh data
        if (userData) {
          setUser(prevUser => ({
            ...prevUser,
            name: userData.name,
            email: userData.email,
            profileIMG: userData.profileIMG,
            googleID: userData.googleID
          }));
        }
        
        setDataLoaded(true);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, setUser]);

  // Fetch user profile data on component mount
  useEffect(() => {
    if (user?.email && backendStatus === 'connected') {
      fetchUserProfile();
    } else if (user?.email) {
      // If backend is not connected, just use the user data from context
      setDataLoaded(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile, backendStatus]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const response = await userService.updateProfile({
        name: updatedProfile.name,
        location: updatedProfile.location,
        isPublic: updatedProfile.isPublic,
        avatar: updatedProfile.avatar
      });

      if (response.success) {
        setProfile(prevProfile => ({
          ...prevProfile,
          ...updatedProfile,
          avatar: response.data.profileIMG || updatedProfile.avatar
        }));
        
        // Update user context
        setUser(prevUser => ({
          ...prevUser,
          name: updatedProfile.name,
          profileIMG: response.data.profileIMG || prevUser.profileIMG
        }));

        setHasUnsavedChanges(false);
        showNotification("Profile updated successfully!", "success");
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showNotification("Failed to update profile. Please try again.", "error");
      throw err; // Re-throw to let component handle it
    }
  };

  const handleSkillsUpdate = async (newSkillsOffered, newSkillsWanted) => {
    try {
      const response = await userService.updateSkills({
        skillsOffered: newSkillsOffered,
        skillsWanted: newSkillsWanted
      });

      if (response.success) {
        setSkillsOffered(newSkillsOffered);
        setSkillsWanted(newSkillsWanted);
        setHasUnsavedChanges(false);
        showNotification("Skills updated successfully!", "success");
      }
    } catch (err) {
      console.error('Error updating skills:', err);
      showNotification("Failed to update skills. Please try again.", "error");
      throw err; // Re-throw to let component handle it
    }
  };

  const handleAboutUpdate = async (newAbout) => {
    try {
      const response = await userService.updateAbout({ about: newAbout });

      if (response.success) {
        setAbout(newAbout);
        setHasUnsavedChanges(false);
        showNotification("About section updated successfully!", "success");
      }
    } catch (err) {
      console.error('Error updating about section:', err);
      showNotification("Failed to update about section. Please try again.", "error");
      throw err; // Re-throw to let component handle it
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  const averageRating = recentFeedback.length > 0 
    ? recentFeedback.reduce((sum, feedback) => sum + feedback.rating, 0) / recentFeedback.length 
    : 0;

  // Handle browser navigation warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Show loading only if we're actually loading and haven't loaded data yet
  if (loading && !dataLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:pl-60 pt-16">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading profile...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !dataLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:pl-60 pt-16">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center">
                <p className="text-destructive">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    setDataLoaded(false);
                    fetchUserProfile();
                  }} 
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      {/* Backend Status Indicator */}
      {backendStatus === 'disconnected' && (
        <div className="fixed top-20 left-4 z-50 bg-warning text-warning-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-warning-foreground rounded-full animate-pulse"></div>
            <span className="text-sm">Backend disconnected - Using demo mode</span>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {showSaveNotification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg animate-fade-in ${
          notificationType === 'success' 
            ? 'bg-success text-success-foreground' 
            : 'bg-destructive text-destructive-foreground'
        }`}>
          {notificationMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-60 pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your profile, skills, and showcase your expertise to the community
              </p>
              {backendStatus === 'disconnected' && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-warning-foreground text-sm">
                    ⚠️ Backend server is not connected. Changes will be saved locally for demonstration purposes.
                  </p>
                </div>
              )}
            </div>

            {/* Profile Header */}
            <ProfileHeader 
              profile={profile} 
              onProfileUpdate={handleProfileUpdate}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Skills and About */}
              <div className="xl:col-span-2 space-y-8">
                <SkillsSection
                  skillsOffered={skillsOffered}
                  skillsWanted={skillsWanted}
                  onSkillsUpdate={handleSkillsUpdate}
                />
                
                <AboutSection
                  about={about}
                  onAboutUpdate={handleAboutUpdate}
                />
              </div>

              {/* Right Column - Feedback and History */}
              <div className="space-y-8">
                <RecentFeedbackSection
                  recentFeedback={recentFeedback}
                  averageRating={averageRating}
                />
                
                <SwapHistorySection
                  swapHistory={swapHistory}
                />
              </div>
            </div>

            {/* Profile Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-primary">{profile.completedSwaps}</div>
                <div className="text-sm text-muted-foreground">Completed Swaps</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-primary">{skillsOffered.length}</div>
                <div className="text-sm text-muted-foreground">Skills Offered</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-primary">{profile.rating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileManagement;