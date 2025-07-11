import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser } from '@/services/api/userService';
import { getCurrentUserPermissions } from '@/services/api/teamsService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Load user permissions from teams data
          try {
            const permissions = await getCurrentUserPermissions(userData.email);
            setUserPermissions(permissions);
          } catch (error) {
            console.warn('Could not load user permissions:', error);
            setUserPermissions({});
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

const login = async (email, password) => {
    try {
      const userData = await signIn(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Load user permissions
      try {
        const permissions = await getCurrentUserPermissions(userData.email);
        setUserPermissions(permissions);
      } catch (error) {
        console.warn('Could not load user permissions:', error);
        setUserPermissions({});
      }
      
      toast.success('Successfully signed in!');
      return userData;
    } catch (error) {
      toast.error(error.message || 'Sign in failed');
      throw error;
    }
  };

const register = async (userData) => {
    try {
      const newUser = await signUp(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Load user permissions
      try {
        const permissions = await getCurrentUserPermissions(newUser.email);
        setUserPermissions(permissions);
      } catch (error) {
        console.warn('Could not load user permissions:', error);
        setUserPermissions({});
      }
      
      toast.success('Account created successfully!');
      return newUser;
    } catch (error) {
      toast.error(error.message || 'Sign up failed');
      throw error;
    }
  };

const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setUserPermissions({});
      localStorage.removeItem('user');
      toast.info('Signed out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if service call fails
      setUser(null);
      setUserPermissions({});
      localStorage.removeItem('user');
    }
  };

  const hasPermission = (permission) => {
    if (!user || !userPermissions) return false;
    
    // Admin users have access to everything
    if (user.role === 'admin') return true;
    
    // Check specific permission
    return userPermissions[permission] === true;
  };

const value = {
    user,
    userPermissions,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};