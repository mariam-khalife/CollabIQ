import { apiRequest } from "./api";

export const getRoles = async () => {
  return apiRequest("/roles/");
};