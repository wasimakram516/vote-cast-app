import api from "./api";

// Get all users (admin only)
export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data.data;
};

// Create a new user (admin only)
export const createUser = async (userData) => {
  const { data } = await api.post("/users", userData);
  return data.data;
};

// Update user (admin only)
export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data.data;
};

// Delete a user (admin only)
export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data.data;
};
