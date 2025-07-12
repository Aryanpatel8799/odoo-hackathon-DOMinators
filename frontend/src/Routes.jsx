import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UserDashboard from "pages/user-dashboard";
import UserProfileManagement from "pages/user-profile-management";
import MessagingSystem from "pages/messaging-system";
import SwapRequestManagement from "pages/swap-request-management";
import AdminPanelDashboard from "pages/admin-panel-dashboard";
import AdminLogin from "pages/admin-login";
import AdminDashboard from "pages/admin-dashboard";
import SkillBrowserSearch from "pages/skill-browser-search";
import  Signin from "pages/o-auth-sign-in/Signin";
import Signup from "pages/o-auth-sign-up/Signup";
import NotFound from "pages/NotFound";
const Routes = () => {
  return (
    <BrowserRouter>

      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<UserDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-profile-management" element={<UserProfileManagement />} />
        <Route path="/messaging-system" element={<MessagingSystem />} />
        <Route path="/swap-request-management" element={<SwapRequestManagement />} />
        <Route path="/admin-panel-dashboard" element={<AdminPanelDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/skill-browser-search" element={<SkillBrowserSearch />} />
        <Route path="/o-auth-sign-in" element={<Signin />} />
        <Route path="/o-auth-sign-up" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>

    </BrowserRouter>
  );
};

export default Routes;