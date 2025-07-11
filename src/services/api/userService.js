import mockUserData from '@/services/mockData/userData.json';

class UserService {
  constructor() {
    this.userData = { ...mockUserData };
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getProfile() {
    await this.delay();
    return { ...this.userData };
  }

  async updateProfile(profileData) {
    await this.delay();
    
    // Validate required fields
    if (!profileData.firstName || !profileData.lastName) {
      throw new Error('First name and last name are required');
    }

    // Update profile data
    this.userData = {
      ...this.userData,
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.userData };
  }

  async updatePassword(currentPassword, newPassword) {
    await this.delay();
    
    // In a real app, you would verify the current password
    if (currentPassword !== 'current123') {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    // Update password (in real app, this would be hashed)
    this.userData.updatedAt = new Date().toISOString();
    
    return { success: true };
  }

  async updateEmail(newEmail, password) {
    await this.delay();
    
    // In a real app, you would verify the password
    if (password !== 'current123') {
      throw new Error('Password is incorrect');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new Error('Invalid email format');
    }

    // Update email
    this.userData.email = newEmail;
    this.userData.updatedAt = new Date().toISOString();
    
    return { success: true };
  }

  async deleteAccount(password) {
    await this.delay();
    
    // In a real app, you would verify the password
    if (password !== 'current123') {
      throw new Error('Password is incorrect');
    }

    // In a real app, this would delete the account
    return { success: true };
  }

  async getPreferences() {
    await this.delay();
    return { ...this.userData.preferences };
  }

  async updatePreferences(preferences) {
    await this.delay();
    
    // Update preferences
    this.userData.preferences = {
      ...this.userData.preferences,
      ...preferences
    };
    this.userData.updatedAt = new Date().toISOString();

    return { ...this.userData.preferences };
  }
}

export default new UserService();