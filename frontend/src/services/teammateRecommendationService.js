import { apiRequest } from "./api";

export const getTeammateRecommendations = async (
  teamId,
  {
    targetRole = "Backend Developer",
    requiredSkills = [],
    requiredInterests = [],
    minimumScore = 0,
    maximumResults = 5,
  } = {}
) => {
  const params = new URLSearchParams();

  params.set("target_role", targetRole);
  params.set("minimum_score", String(minimumScore));
  params.set("maximum_results", String(maximumResults));

  requiredSkills.forEach((skill) => {
    params.append("required_skills", skill);
  });

  requiredInterests.forEach((interest) => {
    params.append("required_interests", interest);
  });

  return apiRequest(
    `/teams/${teamId}/teammate-recommendations?${params.toString()}`
  );
};