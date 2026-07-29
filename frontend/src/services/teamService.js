import { apiRequest } from "./api";

export const createTeam = async (teamData) => {
  return apiRequest("/teams/", {
    method: "POST",
    body: teamData,
  });
};

export const getTeam = async (teamId) => {
  return apiRequest(`/teams/${teamId}`);
};

export const getTeamMembers = async (teamId) => {
  return apiRequest(`/teams/${teamId}/members`);
};

export const sendTeamInvitation = async (teamId, invitationData) => {
  return apiRequest(`/teams/${teamId}/invitations`, {
    method: "POST",
    body: invitationData,
  });
};

export const removeTeamMember = async (teamId, userId) => {
  return apiRequest(`/teams/${teamId}/members/${userId}`, {
    method: "DELETE",
  });
};

export const getTeamReadiness = async (teamId) => {
  return apiRequest(`/teams/${teamId}/readiness`);
};

export const getTeamInvitations = async (teamId) => {
  return apiRequest(`/teams/${teamId}/invitations`);
};