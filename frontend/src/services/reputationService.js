import { apiRequest } from "./api";

export const getMyReputation = async () =>
  apiRequest("/reputation/me");