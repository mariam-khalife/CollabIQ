import { apiRequest } from "./api";

// The shared interest catalogue. Interests are picked from it rather than
// typed freely, because the backend links a user to an interest by id.
export const getInterestCatalog = async () => {
  return apiRequest("/interests/");
};

export const getUserInterests = async (userId) => {
  return apiRequest(`/users/${userId}/interests`);
};

export const addUserInterest = async (userId, interestId) => {
  return apiRequest(`/users/${userId}/interests`, {
    method: "POST",
    body: {
      interest_id: interestId,
    },
  });
};

export const removeUserInterest = async (
  userId,
  interestId
) => {
  return apiRequest(`/users/${userId}/interests/${interestId}`, {
    method: "DELETE",
  });
};
