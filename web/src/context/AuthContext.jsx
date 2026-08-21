import { useState } from 'react';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    return storedUser && storedToken ? JSON.parse(storedUser) : null;
  });

  const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    const { token, ...userDataResponse } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userDataResponse));
    setUser(userDataResponse);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    const { token, ...userDataResponse } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userDataResponse));
    setUser(userDataResponse);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};