import mockData from '../mockData/user.json';

class UserService {
  constructor() {
    this.data = { ...mockData };
  }

  // Profile operations
  async getProfile() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.data.profile });
      }, 300);
    });
  }

  async updateProfile(profileData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.data.profile = { ...this.data.profile, ...profileData };
        resolve({ ...this.data.profile });
      }, 500);
    });
  }

  // Account Settings operations
  async getAccountSettings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.data.accountSettings });
      }, 300);
    });
  }

  async updateAccountSettings(settingsData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.data.accountSettings = { ...this.data.accountSettings, ...settingsData };
        resolve({ ...this.data.accountSettings });
      }, 500);
    });
  }

  async changePassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === 'oldpassword') {
          this.data.accountSettings.passwordLastChanged = new Date().toISOString();
          resolve({ success: true });
        } else {
          reject(new Error('Current password is incorrect'));
        }
      }, 800);
    });
  }

  // Preferences operations
  async getPreferences() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.data.preferences });
      }, 300);
    });
  }

  async updatePreferences(preferencesData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.data.preferences = { ...this.data.preferences, ...preferencesData };
        resolve({ ...this.data.preferences });
      }, 500);
    });
  }

  // Avatar upload
  async uploadAvatar(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const avatarUrl = URL.createObjectURL(file);
        this.data.profile.avatar = avatarUrl;
        resolve({ avatarUrl });
      }, 1000);
    });
  }
}

export default new UserService();