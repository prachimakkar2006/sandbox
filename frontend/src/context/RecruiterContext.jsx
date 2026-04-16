import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const RecruiterContext = createContext(null);

export function RecruiterProvider({ children }) {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('eraai_recruiter');
    const token = localStorage.getItem('eraai_recruiter_token');
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        setRecruiter(parsed);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('eraai_recruiter');
        localStorage.removeItem('eraai_recruiter_token');
      }
    }
    setLoading(false);
  }, []);

  const persist = (data) => {
    setRecruiter(data);
    localStorage.setItem('eraai_recruiter', JSON.stringify(data));
    localStorage.setItem('eraai_recruiter_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/recruiter/login', { email, password });
    persist(data);
    return data;
  };

  const register = async (form) => {
    const { data } = await axios.post('/api/recruiter/register', form);
    persist(data);
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await axios.post('/api/recruiter/auth/google', { credential });
    persist(data);
    return data;
  };

  const logout = () => {
    setRecruiter(null);
    localStorage.removeItem('eraai_recruiter');
    localStorage.removeItem('eraai_recruiter_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateRecruiter = (data) => {
    const merged = { ...recruiter, ...data };
    setRecruiter(merged);
    localStorage.setItem('eraai_recruiter', JSON.stringify(merged));
  };

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('eraai_recruiter_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, []);

  return (
    <RecruiterContext.Provider value={{ recruiter, loading, login, register, googleLogin, logout, updateRecruiter, getAuthConfig }}>
      {children}
    </RecruiterContext.Provider>
  );
}

export const useRecruiter = () => useContext(RecruiterContext);
