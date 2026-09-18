import { createContext, useContext, useState } from "react";
import {
  loginStudent,
  loginAdmin,
} from "../services/authService";
import {
  saveToken,
  saveUser,
  getToken,
  getUser,
  clearAuthData,
} from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  const isAuthenticated = !!token;

  // Student Login
  const studentLogin = async (loginData) => {
    const response = await loginStudent(loginData);

    const newToken = response.data.token;

    const newUser = {
      ...response.data.student,
      role: "STUDENT",
    };

    saveToken(newToken);
    saveUser(newUser);

    setToken(newToken);
    setUser(newUser);

    return response;
  };

  // Admin Login
  const adminLogin = async (loginData) => {
    const response = await loginAdmin(loginData);

    const newToken = response.data.token;

    const newUser = {
      ...response.data.admin,
      role: "ADMIN",
    };

    saveToken(newToken);
    saveUser(newUser);

    setToken(newToken);
    setUser(newUser);

    return response;
  };

  // Update the current user in context and localStorage
  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };

    saveUser(updatedUser);
    setUser(updatedUser);
  };

  // Logout
  const logout = () => {
    clearAuthData();

    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated,
    studentLogin,
    adminLogin,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};