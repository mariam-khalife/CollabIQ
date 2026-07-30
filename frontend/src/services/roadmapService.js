import { apiRequest } from "./api";

export const createRoadmap = async (roadmapData) => {
  return apiRequest("/roadmaps/", {
    method: "POST",
    body: roadmapData,
  });
};

export const getProjectRoadmap = async (projectId) => {
  return apiRequest(`/roadmaps/project/${projectId}`);
};

export const getRoadmapProgress = async (roadmapId) => {
  return apiRequest(`/roadmaps/${roadmapId}/progress`);
};

export const updateRoadmapPhase = async (
  phaseId,
  phaseData
) => {
  return apiRequest(
    `/roadmaps/phases/${phaseId}`,
    {
      method: "PUT",
      body: phaseData,
    }
  );
};

export const deleteRoadmapPhase = async (phaseId) => {
  return apiRequest(
    `/roadmaps/phases/${phaseId}`,
    {
      method: "DELETE",
    }
  );
};

export const updatePhaseStatus = async (
  phaseId,
  status
) => {
  return apiRequest(
    `/roadmaps/phases/${phaseId}/status`,
    {
      method: "PATCH",
      body: {
        status,
      },
    }
  );
};

export const addRoadmapPhase = async (
  roadmapId,
  phaseData
) => {
  return apiRequest(
    `/roadmaps/${roadmapId}/phases`,
    {
      method: "POST",
      body: phaseData,
    }
  );
};