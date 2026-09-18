import api from "./api";

// Student Registration
export const registerStudent = async (studentData) => {
  const response = await api.post("/savestudent", studentData);
  return response.data;
};

// Student Login
export const loginStudent = async (loginData) => {
  const response = await api.post("/login", loginData);
  return response.data;
};

// Admin Registration
export const registerAdmin = async (adminData) => {
  const response = await api.post("/saveadmin", adminData);
  return response.data;
};

// Admin Login
export const loginAdmin = async (loginData) => {
  const response = await api.post("/adminlogin", loginData);
  return response.data;
};