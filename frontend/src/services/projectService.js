import { apiRequest } from "./api";

export const getTeamProject = async (teamId) => {
  return apiRequest(`/projects/team/${teamId}`);
};

export const createProject = async (projectData) => {
  return apiRequest("/projects/", {
    method: "POST",
    body: projectData,
  });
};

export const updateProject = async (projectId, projectData) => {
  return apiRequest(`/projects/${projectId}`, {
    method: "PUT",
    body: projectData,
  });
};

export const deleteProject = async (projectId) => {
  return apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
  });
};