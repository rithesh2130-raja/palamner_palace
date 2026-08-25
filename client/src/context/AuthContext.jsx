import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.palamner@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'creator', // Enable creator & admin capabilities by default in dev
    pincode: '517408',
    city: 'Palamner, Andhra Pradesh'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleAuth = () => {
    setIsLoggedIn(prev => !prev);
  };

  const login = (userData) => {
    setUser(userData || {
      name: 'Rajesh Kumar',
      email: 'rajesh.palamner@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'creator',
      pincode: '517408',
      city: 'Palamner, Andhra Pradesh'
    });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAuthenticated: isLoggedIn, login, logout, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
