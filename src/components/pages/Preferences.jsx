import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from "@/atoms/Button"
import { Card } from '@/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import userService from "@/services/api/userService";

const Preferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getPreferences();
      setPreferences(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key, value) => {
    try {
      setSaving(true);
      const updatedPreferences = await userService.updatePreferences({
        ...preferences,
        [key]: value
      });
      setPreferences(updatedPreferences);
      toast.success('Preference updated successfully');
    } catch (err) {
      toast.error('Failed to update preference');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (theme) => {
    updatePreference('theme', theme);
  };

  const handleNotificationToggle = (type) => {
    updatePreference('notifications', {
      ...preferences.notifications,
      [type]: !preferences.notifications[type]
    });
  };

  const handleLanguageChange = (language) => {
    updatePreference('language', language);
  };

  const handleTimezoneChange = (timezone) => {
    updatePreference('timezone', timezone);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPreferences} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Preferences</h1>
        <p className="text-gray-600">Customize your application experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Palette" size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Theme</h3>
              <p className="text-sm text-gray-600">Choose your preferred theme</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { value: 'light', label: 'Light Theme', icon: 'Sun' },
              { value: 'dark', label: 'Dark Theme', icon: 'Moon' },
              { value: 'auto', label: 'Auto (System)', icon: 'Monitor' }
            ].map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                disabled={saving}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  preferences?.theme === theme.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name={theme.icon} size={18} />
                  <span className="font-medium">{theme.label}</span>
                </div>
                {preferences?.theme === theme.value && (
                  <ApperIcon name="Check" size={18} className="text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bell" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
              { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
              { key: 'sms', label: 'SMS Notifications', description: 'Receive text message notifications' },
              { key: 'desktop', label: 'Desktop Notifications', description: 'Show desktop notifications' }
            ].map((notification) => (
              <div key={notification.key} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{notification.label}</h4>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(notification.key)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences?.notifications?.[notification.key]
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences?.notifications?.[notification.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Globe" size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Language</h3>
              <p className="text-sm text-gray-600">Choose your preferred language</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { value: 'en', label: 'English', flag: '🇺🇸' },
              { value: 'es', label: 'Español', flag: '🇪🇸' },
              { value: 'fr', label: 'Français', flag: '🇫🇷' },
              { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
              { value: 'it', label: 'Italiano', flag: '🇮🇹' },
              { value: 'pt', label: 'Português', flag: '🇵🇹' }
            ].map((language) => (
              <button
                key={language.value}
                onClick={() => handleLanguageChange(language.value)}
                disabled={saving}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  preferences?.language === language.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.label}</span>
                </div>
                {preferences?.language === language.value && (
                  <ApperIcon name="Check" size={18} className="text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Time & Date Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Time & Date</h3>
              <p className="text-sm text-gray-600">Configure time and date preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select
                value={preferences?.timezone || 'UTC'}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">Eastern Time (UTC-5)</option>
                <option value="America/Chicago">Central Time (UTC-6)</option>
                <option value="America/Denver">Mountain Time (UTC-7)</option>
                <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                <option value="Europe/London">London (UTC+0)</option>
                <option value="Europe/Paris">Paris (UTC+1)</option>
                <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                <option value="Asia/Shanghai">Shanghai (UTC+8)</option>
                <option value="Australia/Sydney">Sydney (UTC+11)</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">24-Hour Format</h4>
                <p className="text-sm text-gray-600">Use 24-hour time format</p>
              </div>
              <button
                onClick={() => updatePreference('timeFormat', preferences?.timeFormat === '24h' ? '12h' : '24h')}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences?.timeFormat === '24h'
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences?.timeFormat === '24h' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Save All Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => toast.success('All preferences saved successfully')}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} />
              Save All Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Preferences;