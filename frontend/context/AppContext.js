import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
// Note: You'll need to run: npx expo install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Auth Methods ---
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.token);
      await AsyncStorage.setItem('token', res.data.token);
      setUser({ name, email }); // Optionally decode the token or fetch full profile here
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      await AsyncStorage.setItem('token', res.data.token);
      setUser({ email }); 
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setExpenses([]);
    setSummary([]);
    await AsyncStorage.removeItem('token');
  };

  // --- Expense Methods ---
  const fetchExpenses = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await api.get('/expenses', {
        headers: { 'x-auth-token': token }
      });
      setExpenses(res.data);
    } catch (error) {
      console.error('Fetch expenses error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!token) return;
    try {
      const res = await api.get('/expenses/summary', {
        headers: { 'x-auth-token': token }
      });
      setSummary(res.data);
    } catch (error) {
      console.error('Fetch summary error:', error.response?.data || error.message);
    }
  };

  const addExpense = async (expenseData) => {
    if (!token) return;
    try {
      const res = await api.post('/expenses', expenseData, {
        headers: { 'x-auth-token': token }
      });
      // Add the new expense to the top of the list
      setExpenses([res.data, ...expenses]);
      // Update summary to reflect the new expense
      fetchSummary();
    } catch (error) {
      console.error('Add expense error:', error.response?.data || error.message);
    }
  };

  // Load token from storage when the app mounts
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  return (
    <AppContext.Provider value={{
      user, token, expenses, summary, isLoading,
      register, login, logout, fetchExpenses, fetchSummary, addExpense
    }}>
      {children}
    </AppContext.Provider>
  );
};