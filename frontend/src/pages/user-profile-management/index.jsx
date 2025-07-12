import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ProfileHeader from './components/ProfileHeader';
import SkillsSection from './components/SkillsSection';
import AboutSection from './components/AboutSection';
import SwapHistorySection from './components/SwapHistorySection';
import RecentFeedbackSection from './components/RecentFeedbackSection';

const UserProfileManagement = () => {
  const [profile, setProfile] = useState({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    isAvailable: true,
    isPublic: true,
    rating: 4.8,
    reviewCount: 24,
    completedSwaps: 18,
    joinedDate: "2023-01-15"
  });

  const [skillsOffered, setSkillsOffered] = useState([
    { id: 1, name: "JavaScript", category: "Programming", proficiency: "Advanced" },
    { id: 2, name: "React", category: "Programming", proficiency: "Advanced" },
    { id: 3, name: "UI/UX Design", category: "Design", proficiency: "Intermediate" },
    { id: 4, name: "Photography", category: "Art", proficiency: "Intermediate" },
    { id: 5, name: "Spanish", category: "Language", proficiency: "Beginner" }
  ]);

  const [skillsWanted, setSkillsWanted] = useState([
    { id: 6, name: "Python", category: "Programming" },
    { id: 7, name: "Data Science", category: "Programming" },
    { id: 8, name: "Guitar", category: "Music" },
    { id: 9, name: "French", category: "Language" },
    { id: 10, name: "Cooking", category: "Cooking" }
  ]);

  const [about, setAbout] = useState(`Passionate software developer with 5+ years of experience in web development. I love sharing knowledge and learning new skills from others in the community.\n\nWhen I'm not coding, you can find me exploring photography, learning new languages, or planning my next travel adventure. I believe in the power of skill exchange to build meaningful connections and grow together as a community.`);

  const [swapHistory] = useState([
    {
      id: 1,
      partner: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      },
      skillOffered: "JavaScript",
      skillReceived: "Python",
      status: "completed",
      completedDate: "2024-07-05",
      duration: "2 hours",
      format: "Video call",
      rating: 5,
      partnerRating: 4,
      feedback: "John was an excellent teacher! His explanations were clear and he provided great resources for continued learning."
    },
    {
      id: 2,
      partner: {
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      skillOffered: "React",
      skillReceived: "Guitar",
      status: "completed",
      completedDate: "2024-06-28",
      duration: "1.5 hours",
      format: "In-person",
      rating: 4,
      partnerRating: 5,
      feedback: "Great session! John helped me understand React hooks much better."
    },
    {
      id: 3,
      partner: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      },
      skillOffered: "UI/UX Design",
      skillReceived: "French",
      status: "completed",
      completedDate: "2024-06-15",
      duration: "2.5 hours",
      format: "Video call",
      rating: 5,
      partnerRating: 4,
      feedback: "John's design insights were incredibly valuable. He helped me improve my portfolio significantly."
    }
  ]);

  const [recentFeedback] = useState([
    {
      id: 1,
      reviewer: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      },
      skillExchanged: "JavaScript for Python",
      rating: 5,
      comment: "John was an excellent teacher! His explanations were clear and he provided great resources for continued learning. Highly recommend!",
      date: "2024-07-05",
      tags: ["Patient", "Knowledgeable", "Well-prepared"]
    },
    {
      id: 2,
      reviewer: {
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      skillExchanged: "React for Guitar",
      rating: 4,
      comment: "Great session! John helped me understand React hooks much better. Looking forward to our next exchange.",
      date: "2024-06-28",
      tags: ["Helpful", "Experienced"]
    },
    {
      id: 3,
      reviewer: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      },
      skillExchanged: "UI/UX Design for French",
      rating: 5,
      comment: "John's design insights were incredibly valuable. He helped me improve my portfolio significantly.",
      date: "2024-06-15",
      tags: ["Creative", "Insightful", "Professional"]
    }
  ]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setHasUnsavedChanges(false);
    showSuccessNotification("Profile updated successfully!");
  };

  const handleSkillsUpdate = (newSkillsOffered, newSkillsWanted) => {
    setSkillsOffered(newSkillsOffered);
    setSkillsWanted(newSkillsWanted);
    setHasUnsavedChanges(false);
    showSuccessNotification("Skills updated successfully!");
  };

  const handleAboutUpdate = (newAbout) => {
    setAbout(newAbout);
    setHasUnsavedChanges(false);
    showSuccessNotification("About section updated successfully!");
  };

  const showSuccessNotification = (message) => {
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  const averageRating = recentFeedback.reduce((sum, feedback) => sum + feedback.rating, 0) / recentFeedback.length;

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      {/* Success Notification */}
      {showSaveNotification && (
        <div className="fixed top-20 right-4 z-50 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          Changes saved successfully!
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
                <div className="text-2xl font-bold text-primary">{profile.rating}</div>
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