import { apiRequest } from "./api";

export const getProjectRoadmap = async (projectId) => {
  return apiRequest(`/roadmaps/project/${projectId}`);
};

export const getRoadmapProgress = async (roadmapId) => {
  return apiRequest(`/roadmaps/${roadmapId}/progress`);
};

export const updatePhaseStatus = async (
  phaseId,
  status
) => {
  return apiRequest(`/roadmaps/phases/${phaseId}/status`, {
    method: "PATCH",
    body: {
      status,
    },
  });
};