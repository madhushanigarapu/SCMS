// Save JWT token
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove JWT token
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Save logged-in user
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get logged-in user
export const getUser = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    // Corrupted value — clear it so the app doesn't crash on every load
    localStorage.removeItem("user");
    return null;
  }
};

// Remove logged-in user
export const removeUser = () => {
  localStorage.removeItem("user");
};

// Clear authentication data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};