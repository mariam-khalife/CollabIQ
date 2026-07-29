import { apiRequest } from "./api";

export const getMyInvitations = async () => {
  return apiRequest("/invitations/me");
};

export const acceptInvitation = async (invitationId) => {
  return apiRequest(`/invitations/${invitationId}/accept`, {
    method: "PUT",
  });
};

export const declineInvitation = async (invitationId) => {
  return apiRequest(`/invitations/${invitationId}/decline`, {
    method: "PUT",
  });
};