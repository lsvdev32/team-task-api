import api from "./api";

export const loginRequest = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerRequest = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};