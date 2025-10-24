import React, { createContext, useContext, useState, useEffect } from 'react';

// --- ADD THIS CONSTANT ---
const API_BASE_URL = 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (currentUser && token) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [currentUser, token]);

  const authHeader = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const login = async (email, password) => {
    // --- MODIFIED: Use full URL ---
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }

    const data = await response.json();
    setCurrentUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    setToken(data.token);
    return data;
  };

  const signup = async (name, email, password) => {
    // --- MODIFIED: Use full URL ---
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign up');
    }
    
    const data = await response.json();
    setCurrentUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    setToken(data.token);
    return data;
  };

  const logout = () => {
    console.log('Logging out');
    setCurrentUser(null);
    setToken(null);
  };

  const value = {
    currentUser,
    token,
    login,
    signup,
    logout,
    authHeader
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};