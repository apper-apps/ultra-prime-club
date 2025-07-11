import mockData from '@/services/mockData/users.json';

let users = [...mockData];
let currentUser = null;

// Helper function to generate unique ID
const generateId = () => {
  return users.length > 0 ? Math.max(...users.map(u => u.Id)) + 1 : 1;
};

// Helper function to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication methods
export const signIn = async (email, password) => {
  await delay();
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Update last login
  const userIndex = users.findIndex(u => u.Id === user.Id);
  users[userIndex] = {
    ...user,
    lastLogin: new Date().toISOString()
  };
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = users[userIndex];
  currentUser = userWithoutPassword;
  
  return userWithoutPassword;
};

export const signUp = async (userData) => {
  await delay();
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  // Create new user
  const newUser = {
    Id: generateId(),
    ...userData,
    role: userData.role || 'sales_rep',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = newUser;
  currentUser = userWithoutPassword;
  
  return userWithoutPassword;
};

export const signOut = async () => {
  await delay(100);
  currentUser = null;
  return true;
};

export const getCurrentUser = () => {
  return currentUser;
};

// Standard CRUD operations
export const getAll = async () => {
  await delay();
  return users.map(({ password, ...user }) => user);
};

export const getById = async (id) => {
  await delay();
  
  const userId = parseInt(id);
  if (isNaN(userId)) {
    throw new Error('Invalid user ID');
  }
  
  const user = users.find(u => u.Id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const create = async (userData) => {
  await delay();
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  const newUser = {
    Id: generateId(),
    ...userData,
    role: userData.role || 'sales_rep',
    createdAt: new Date().toISOString(),
    lastLogin: null
  };
  
  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const update = async (id, userData) => {
  await delay();
  
  const userId = parseInt(id);
  if (isNaN(userId)) {
    throw new Error('Invalid user ID');
  }
  
  const userIndex = users.findIndex(u => u.Id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Check if email already exists (excluding current user)
  if (userData.email) {
    const existingUser = users.find(u => u.email === userData.email && u.Id !== userId);
    if (existingUser) {
      throw new Error('Email already exists');
    }
  }
  
  // Update user (exclude Id from update data)
  const { Id: _, ...updateData } = userData;
  users[userIndex] = {
    ...users[userIndex],
    ...updateData
  };
  
  const { password: __, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

export const deleteUser = async (id) => {
  await delay();
  
  const userId = parseInt(id);
  if (isNaN(userId)) {
    throw new Error('Invalid user ID');
  }
  
  const userIndex = users.findIndex(u => u.Id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  users.splice(userIndex, 1);
  return true;
};

// Export delete with standard name for consistency
export const deleteById = deleteUser;