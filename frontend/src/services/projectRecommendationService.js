import { apiRequest } from "./api";

export const getProjectRecommendations = async (teamId) =>
  apiRequest(`/teams/${teamId}/project-recommendations`);

export const generateProjectRecommendations = async (
  teamId,
  count = 5
) =>
  apiRequest(
    `/teams/${teamId}/project-recommendations/generate?count=${count}`,
    {
      method: "POST",
    }
  );