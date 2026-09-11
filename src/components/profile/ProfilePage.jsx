import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import userApi from '../../api/userApi';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';
import PageHeader from '../common/PageHeader';
import { UserRound } from 'lucide-react';
import { getDisplayName, getInitials } from '../../utils/userDisplay';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'
  const ignoreSubmitUntil = useRef(0);
  
  // Profile form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    profileImage: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const snapshotFromUser = (current) => ({
    username: current?.username || '',
    email: current?.email || '',
    firstName: current?.firstName || '',
    lastName: current?.lastName || '',
    phone: current?.phone || '',
    profileImage: current?.profileImage || ''
  });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData(snapshotFromUser(user));
    }
  }, [user, isEditing]);

  const isProfileDirty = () =>
    JSON.stringify(formData) !== JSON.stringify(snapshotFromUser(user));

  const startEditing = (event) => {
    event.preventDefault();
    event.stopPropagation();
    ignoreSubmitUntil.current = Date.now() + 400;
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData(snapshotFromUser(user));
  };

  // Handle profile form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing || Date.now() < ignoreSubmitUntil.current) return;
    if (!isProfileDirty()) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.updateProfile(formData);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Submit password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await userApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'STUDENT': 'bg-indigo-50 text-indigo-800',
      'TEAM_LEADER': 'bg-indigo-50 text-indigo-800',
      'LECTURER': 'bg-green-50 text-green-800',
      'ADMIN': 'bg-red-50 text-red-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  const fieldClass = `field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`;

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        icon={UserRound}
        title="Profile"
        description="Manage your account settings and preferences."
      />

      <div className="surface overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-xl font-semibold text-indigo-700 shrink-0">
              {getInitials(user)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">{getDisplayName(user)}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 px-5 sm:px-6">
          <nav className="flex gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-3.5 px-1 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`py-3.5 px-1 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Change password
            </button>
          </nav>
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">First name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="label">Last name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="label">Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label className="label">Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="label">Role</label>
                  <input
                    type="text"
                    value={user.role || 'STUDENT'}
                    disabled
                    className="field bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="btn-primary"
                  >
                    Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={loading || !isProfileDirty()}
                      className="btn-primary"
                    >
                      {loading ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="label">Current password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="field"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="label">New password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="field"
                    placeholder="Enter new password (min. 8 characters)"
                    required
                  />
                </div>

                <div>
                  <label className="label">Confirm new password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="field"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Updating...' : 'Change password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="surface p-5 sm:p-6">
        <h3 className="font-semibold text-ink mb-4">Account information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Account created</span>
            <p className="mt-0.5 text-ink">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Account status</span>
            <p className="mt-1">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                user.status === 'ACTIVE' ? 'bg-green-50 text-green-800' :
                user.status === 'PENDING_VERIFICATION' ? 'bg-amber-50 text-amber-800' :
                'bg-red-50 text-red-700'
              }`}>
                {user.status || 'ACTIVE'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
