import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    username: 'admin',
    email: 'admin@skillswap.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    maxSwapsPerUser: 10,
    autoBanThreshold: 3
  });

  const handleAdminProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Admin profile updated successfully!');
    }, 1000);
  };

  const handlePlatformSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Platform settings updated successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: 'Settings' },
    { id: 'admin', label: 'Admin Profile', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-sm text-muted-foreground">Manage platform configuration and admin account</p>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <Icon name={tab.icon} size={20} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'general' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-6">General Settings</h2>
              <form onSubmit={handlePlatformSettingsUpdate} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                      <p className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={platformSettings.maintenanceMode}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Allow New Registrations</h3>
                      <p className="text-sm text-muted-foreground">Enable or disable new user registrations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={platformSettings.allowNewRegistrations}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, allowNewRegistrations: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Require Email Verification</h3>
                      <p className="text-sm text-muted-foreground">Force users to verify their email address</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={platformSettings.requireEmailVerification}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, requireEmailVerification: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Max Swaps Per User
                      </label>
                      <input
                        type="number"
                        value={platformSettings.maxSwapsPerUser}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, maxSwapsPerUser: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Auto Ban Threshold
                      </label>
                      <input
                        type="number"
                        value={platformSettings.autoBanThreshold}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, autoBanThreshold: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-6">Admin Profile</h2>
              <form onSubmit={handleAdminProfileUpdate} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <Input
                    label="Username"
                    value={adminProfile.username}
                    onChange={(e) => setAdminProfile(prev => ({ ...prev, username: e.target.value }))}
                    disabled
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) => setAdminProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    label="Current Password"
                    type="password"
                    value={adminProfile.currentPassword}
                    onChange={(e) => setAdminProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={adminProfile.newPassword}
                    onChange={(e) => setAdminProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={adminProfile.confirmPassword}
                    onChange={(e) => setAdminProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Session Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage active admin sessions and security settings
                  </p>
                  <Button variant="outline" iconName="LogOut" iconPosition="left">
                    Logout All Sessions
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enable 2FA for additional security
                  </p>
                  <Button variant="outline" iconName="Shield" iconPosition="left">
                    Setup 2FA
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">API Keys</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage API keys for external integrations
                  </p>
                  <Button variant="outline" iconName="Key" iconPosition="left">
                    Manage API Keys
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-6">Notification Settings</h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">New User Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified when new users register</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Report Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified about user reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSettings; 