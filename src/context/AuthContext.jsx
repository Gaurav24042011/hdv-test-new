import React, { createContext, useContext, useState,useEffect } from 'react';
import { setCookie,deleteCookie,getCookie } from "../utils/cookieUtility";
import { USER_DETAILS } from '../const/common';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({name:'',mobile:'',token:'', role:'',id:'',profilePhoto:''});

  useEffect(() => {
    const savedUser = getCookie(USER_DETAILS);
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Parse the cookie and set the user
    }
  }, []);

  const login = (userData) => {
    setCookie(USER_DETAILS, userData)
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    deleteCookie(USER_DETAILS)
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
