import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import Layout from '../components/Layout/Layout';
import { User, Lock, Building, Bell, Shield, CreditCard, Save, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  companyName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  role: string;
  createdAt: Date;
}

interface NotificationSettings {
  emailNotifications: boolean;
  surveyReminders: boolean;
  reportGeneration: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

const Settings: React.FC = () => {
  const { state: authState } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    email: '',
    companyName: '',
    firstName: '',
    lastName: '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
    role: '',
    createdAt: new Date(),
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    surveyReminders: true,
    reportGeneration: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
  }, [authState.token]);

  const fetchUserData = async () => {
    if (!authState.token) return;

    setLoading(true);
    try {
      // In a real app, you'd fetch from the API
      // For now, using auth state data
      setProfile({
        id: authState.user?.id || '',
        email: authState.user?.email || '',
        companyName: authState.user?.companyName || '',
        firstName: '',
        lastName: '',
        phone: '',
        timezone: 'UTC',
        language: 'en',
        role: authState.user?.role || '',
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', text: 'Failed to load user data' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (!authState.token) return;

    setSaving(true);
    try {
      const response = await api.updateUserProfile(profile, authState.token);
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!authState.token) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setSaving(true);
    try {
      const response = await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, authState.token);

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    setSaving(true);
    try {
      // In a real app, would save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Notification preferences updated' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notifications' });
    } finally {
      setSaving(false);
    }
  };

  const generateApiKey = async () => {
    setSaving(true);
    try {
      // In a real app, would generate via API
      const newKey = {
        id: Date.now().toString(),
        name: `API Key ${apiKeys.length + 1}`,
        key: 'sk_' + Math.random().toString(36).substring(2, 15),
        createdAt: new Date(),
        lastUsed: null,
      };
      setApiKeys([...apiKeys, newKey]);
      setMessage({ type: 'success', text: 'API key generated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate API key' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading settings...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Settings</h1>
          <p className="text-navy-600">Manage your account settings and preferences</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-sustainability-50 text-sustainability-700 border border-sustainability-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-trust-50 text-trust-700 border-l-4 border-trust-500'
                        : 'text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-navy-200">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-navy-800 mb-6">Profile Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={profile.companyName}
                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                        className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={profile.timezone}
                          onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                          className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Language
                        </label>
                        <select
                          value={profile.language}
                          onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                          className="w-full px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleProfileSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-navy-800 mb-6">Security Settings</h3>
                  
                  {/* Password Change */}
                  <div className="space-y-6 mb-8">
                    <h4 className="font-medium text-navy-700">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.current ? <EyeOff className="w-5 h-5 text-navy-400" /> : <Eye className="w-5 h-5 text-navy-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.new ? <EyeOff className="w-5 h-5 text-navy-400" /> : <Eye className="w-5 h-5 text-navy-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-5 h-5 text-navy-400" /> : <Eye className="w-5 h-5 text-navy-400" />}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        disabled={saving}
                        className="px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700 disabled:opacity-50"
                      >
                        {saving ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="border-t border-navy-200 pt-6 mb-8">
                    <h4 className="font-medium text-navy-700 mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-navy-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`px-4 py-2 rounded-lg ${
                          twoFactorEnabled 
                            ? 'bg-sustainability-600 text-white hover:bg-sustainability-700' 
                            : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                        }`}
                      >
                        {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                      </button>
                    </div>
                  </div>

                  {/* API Keys */}
                  <div className="border-t border-navy-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-navy-700">API Keys</h4>
                      <button
                        onClick={generateApiKey}
                        disabled={saving}
                        className="px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700 disabled:opacity-50"
                      >
                        Generate New Key
                      </button>
                    </div>
                    <div className="space-y-3">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
                          <div>
                            <p className="font-medium text-navy-800">{key.name}</p>
                            <p className="text-sm text-navy-600 font-mono">{key.key}</p>
                          </div>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            Revoke
                          </button>
                        </div>
                      ))}
                      {apiKeys.length === 0 && (
                        <p className="text-sm text-navy-500">No API keys generated yet</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-navy-800 mb-6">Notification Preferences</h3>
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-navy-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-sm text-navy-600">
                            {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                            {key === 'surveyReminders' && 'Get reminders about pending survey responses'}
                            {key === 'reportGeneration' && 'Notifications when reports are generated'}
                            {key === 'securityAlerts' && 'Important security and account alerts'}
                            {key === 'marketingEmails' && 'Product updates and marketing communications'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [key]: !value })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-trust-600' : 'bg-navy-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleNotificationSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-navy-800 mb-6">Billing Settings</h3>
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-navy-400 mx-auto mb-4" />
                    <p className="text-navy-600 mb-4">
                      Billing settings are managed in the dedicated Billing section
                    </p>
                    <button
                      onClick={() => window.location.href = '/billing'}
                      className="px-4 py-2 bg-trust-600 text-white rounded-lg hover:bg-trust-700"
                    >
                      Go to Billing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;