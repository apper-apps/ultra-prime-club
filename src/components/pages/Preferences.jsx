import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import userService from '@/services/api/userService';

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

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updatePreferences(preferences);
      toast.success('Preferences updated successfully');
    } catch (err) {
      toast.error('Failed to update preferences');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (field) => {
    setPreferences(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSelectChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPreferences} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Preferences</h1>
        <p className="text-gray-600">Customize your experience and display settings</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSelectChange('theme', 'light')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    preferences.theme === 'light' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name="Sun" size={16} />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => handleSelectChange('theme', 'dark')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    preferences.theme === 'dark' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name="Moon" size={16} />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => handleSelectChange('theme', 'system')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    preferences.theme === 'system' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name="Monitor" size={16} />
                  <span>System</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Compact Mode</h4>
                <p className="text-sm text-gray-600">Use more compact spacing throughout the app</p>
              </div>
              <button
                onClick={() => handleToggle('compactMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.compactMode ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard Layout</label>
              <select
                value={preferences.dashboardLayout}
                onChange={(e) => handleSelectChange('dashboardLayout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="grid">Grid Layout</option>
                <option value="list">List Layout</option>
                <option value="cards">Card Layout</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Localization */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Localization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => handleSelectChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CHF">CHF (Fr)</option>
                <option value="CNY">CNY (¥)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
              <select
                value={preferences.timeFormat}
                onChange={(e) => handleSelectChange('timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number Format</label>
              <select
                value={preferences.numberFormat}
                onChange={(e) => handleSelectChange('numberFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="comma">1,234.56</option>
                <option value="period">1.234,56</option>
                <option value="space">1 234,56</option>
              </select>
            </div>
          </div>
        </Card>

        {/* General Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Page</label>
              <select
                value={preferences.defaultPage}
                onChange={(e) => handleSelectChange('defaultPage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="dashboard">Dashboard</option>
                <option value="leads">Leads</option>
                <option value="pipeline">Pipeline</option>
                <option value="analytics">Analytics</option>
                <option value="calendar">Calendar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Items per Page</label>
              <select
                value={preferences.itemsPerPage}
                onChange={(e) => handleSelectChange('itemsPerPage', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Auto-save</h4>
                <p className="text-sm text-gray-600">Automatically save changes as you work</p>
              </div>
              <button
                onClick={() => handleToggle('autoSave')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.autoSave ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Show Welcome Message</h4>
                <p className="text-sm text-gray-600">Display welcome message on login</p>
              </div>
              <button
                onClick={() => handleToggle('showWelcomeMessage')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.showWelcomeMessage ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.showWelcomeMessage ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Preferences;