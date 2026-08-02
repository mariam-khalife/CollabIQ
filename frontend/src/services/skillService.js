import { apiRequest } from "./api";

// The shared skill catalogue. Skills are picked from it rather than typed
// freely, because the backend links a user to a skill by id.
export const getSkillCatalog = async () => {
  return apiRequest("/skills/");
};

export const getUserSkills = async (userId) => {
  return apiRequest(`/users/${userId}/skills`);
};

export const addUserSkill = async (
  userId,
  skillId,
  proficiencyLevel
) => {
  return apiRequest(`/users/${userId}/skills`, {
    method: "POST",
    body: {
      skill_id: skillId,
      proficiency_level: proficiencyLevel,
    },
  });
};

export const removeUserSkill = async (userId, skillId) => {
  return apiRequest(`/users/${userId}/skills/${skillId}`, {
    method: "DELETE",
  });
};
