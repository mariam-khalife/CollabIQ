import { apiRequest } from "./api";

export const getCurrentUser = async () => {
  return apiRequest("/auth/me");
};

export const getUserTeams = async (userId) => {
  return apiRequest(`/users/${userId}/teams`);
};

export const searchUsers = async (query) => {
  return apiRequest(
    `/users/search?query=${encodeURIComponent(query)}`
  );
};