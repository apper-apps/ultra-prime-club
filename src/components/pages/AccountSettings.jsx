import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { Button } from "@/atoms/Button";
import { Input } from "@/atoms/Input";
import { Card } from "@/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import userService from "@/services/api/userService";

const AccountSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [changingEmail, setChangingEmail] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getProfile();
      setProfile(data);
      setEmailData(prev => ({ ...prev, newEmail: data.email || '' }));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load account settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setChangingPassword(true);
      await userService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (emailData.newEmail === profile?.email) {
      toast.error('New email is the same as current email');
      return;
    }

    try {
      setChangingEmail(true);
      await userService.updateEmail(emailData.newEmail, emailData.password);
      const updatedProfile = await userService.getProfile();
      setProfile(updatedProfile);
      setEmailData({
        newEmail: updatedProfile.email || '',
        password: ''
      });
      toast.success('Email updated successfully');
    } catch (err) {
      toast.error('Failed to update email');
    } finally {
      setChangingEmail(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const password = window.prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    try {
      await userService.deleteAccount(password);
      toast.success('Account deleted successfully');
      // In a real app, you would redirect to login or logout
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfile} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your account security and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Change */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Lock" size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              disabled={changingPassword}
              className="w-full flex items-center justify-center gap-2"
            >
              {changingPassword ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Email Change */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Mail" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email Address</h3>
              <p className="text-sm text-gray-600">Update your email address</p>
            </div>
          </div>

          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Email
              </label>
              <Input
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Email
              </label>
              <Input
                type="email"
                value={emailData.newEmail}
                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (for confirmation)
              </label>
              <Input
                type="password"
                value={emailData.password}
                onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={changingEmail}
              className="w-full flex items-center justify-center gap-2"
            >
              {changingEmail ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Updating Email...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  Update Email
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              <p className="text-sm text-gray-600">Your account details</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account ID
              </label>
              <p className="text-gray-900 font-mono text-sm">{profile?.Id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <p className="text-gray-900">{profile?.createdAt}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              <p className="text-gray-900">{profile?.updatedAt}</p>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-600">Irreversible actions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Delete Account</h4>
              <p className="text-sm text-gray-600 mb-3">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Trash2" size={16} />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;