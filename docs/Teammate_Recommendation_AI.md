Teammate Recommendation AI
Objective
Develop and finalize the AI-powered Teammate Recommendation System for CollabIQ.
The goal of this system is to recommend the most suitable teammates for a project by analyzing compatibility between candidate profiles and the current project requirements.
The recommendation system evaluates candidates based on:
•	Skills
•	Interests
•	Availability
•	Experience level
•	Required project role
The AI service communicates only with the FastAPI backend and never directly with the frontend.
The AI system only suggests candidates. It does not:
•	Create team members automatically.
•	Send invitations.
•	Accept or reject invitations.
•	Modify the database directly.
The Team Leader reviews the recommendations and makes the final decision to invite candidates.
 
Recommendation Criteria
Each candidate is evaluated using weighted compatibility factors:
Factor	Weight
Skill Match	45%
Required Role Compatibility	25%
Interests Similarity	15%
Availability	10%
Experience Level	5%
Total Weight: 100%
 
Matching Inputs
The backend provides the AI service with the required information.
Current Team Information
•	Team ID
•	Current team members
•	Current team skills
•	Required skills
•	Required roles
•	Project requirements
Candidate Information
Each candidate profile contains:
•	User ID
•	Name
•	Skills
•	Interests
•	Availability
•	Experience level
•	Preferred role
 
Matching Logic
The recommendation algorithm evaluates every candidate using the following factors:
1. Skill Match (45%)
The system compares candidate skills with the required project skills.
Example:
Required:
•	Python
•	FastAPI
•	PostgreSQL
Candidate:
•	Python
•	FastAPI
•	PostgreSQL
Result:
High skill compatibility.
 
2. Role Compatibility (25%)
The system checks whether the candidate role matches the required project role.
Example:
Required Role:
Backend Developer
Candidate Role:
Backend Developer
Result:
High role compatibility.
 
3. Interests Similarity (15%)
The system compares candidate interests with project requirements and team interests.
Example:
Project Interest:
Artificial Intelligence
Candidate Interest:
Machine Learning
Result:
High similarity.
 
4. Availability (10%)
The system evaluates whether the candidate’s availability matches project needs.
 
5. Experience Level (5%)
The system considers whether the candidate’s experience level fits the project requirements.
 
Compatibility Score Formula
The final compatibility score is calculated as:
Compatibility Score =

(Skill Match × 45%)
+
(Role Compatibility × 25%)
+
(Interests Similarity × 15%)
+
(Availability × 10%)
+
(Experience Level × 5%)
The final score ranges from:
0.00 → 1.00
 
Recommendation Rules
The AI recommendation system must:
•	Evaluate all available candidates.
•	Rank candidates from highest compatibility to lowest.
•	Return only the top five recommended teammates.
The system must exclude:
Existing Team Members
Users who are already part of the team must not appear in recommendations.
Previously Invited Users
Users who already received invitations must not appear again.
Duplicate Candidates
The same user cannot appear multiple times.
 
Recommendation Process
Team Leader requests teammate recommendations

↓

Backend retrieves project information

↓

Backend retrieves current team members

↓

Backend retrieves candidate profiles

↓

Remove existing team members

↓

Remove users with pending invitations

↓

Evaluate remaining candidates

↓

Calculate compatibility scores

↓

Rank candidates from highest to lowest

↓

Select top 5 recommendations

↓

Validate AI response

↓

Return recommendations to backend/frontend

↓

Team Leader reviews suggestions
 
AI Recommendation Prompt Requirements
The AI prompt should instruct the model to:
•	Act as a teammate recommendation assistant for CollabIQ.
•	Evaluate candidates using:

o	Skills
o	Interests
o	Availability
o	Experience level
o	Required role
•	Exclude existing team members.
•	Exclude users with pending invitations.
•	Return only the five best candidates.
•	Return structured JSON only.
 
Expected Output Format
The backend integration requires a structured JSON response.
Example:
{
  "status": "success",
  "data": [
    {
      "user_id": "102",
      "name": "John Smith",
      "role": "Backend Developer",
      "compatibility_score": 0.96,
      "reason": "Excellent FastAPI and PostgreSQL experience with strong availability."
    },
    {
      "user_id": "118",
      "name": "Sara Ali",
      "role": "Frontend Developer",
      "compatibility_score": 0.91,
      "reason": "Strong React skills and interests aligned with the project requirements."
    }
  ]
}
 
Recommendation Reason
Each recommended teammate must include a clear explanation.
Examples:
•	Strong FastAPI and PostgreSQL experience.
•	Excellent React and Tailwind CSS skills.
•	Availability matches the project timeline.
•	Experience level fits the team requirements.
•	Provides missing skills needed by the project.
•	Has similar interests related to the project.
 
Backend Integration Requirements
The recommendation output must provide:
•	User ID
•	Candidate name
•	Recommended role
•	Compatibility score
•	Recommendation reason
The backend should receive structured JSON that can be:
•	Validated.
•	Stored.
•	Displayed to the Team Leader.
 
Response Validation
Before returning recommendations, the backend must verify:
•	Response is valid JSON.
•	Required fields exist.
•	Compatibility score is between 0 and 1.
•	User IDs are unique.
•	Maximum number of recommendations is five.
•	Existing team members are excluded.
•	Users with pending invitations are excluded.
•	Recommendation reasons are not empty.
Invalid responses must be rejected.
 
Testing Teammate Recommendations
The system should be tested using different user profiles.
 
Test Case 1 — Strong Skill Match
Requirement:
Backend Developer
Candidate Skills:
•	Python
•	FastAPI
•	PostgreSQL
Expected Result:
•	High compatibility score.
•	Candidate ranked among the top recommendations.
 
Test Case 2 — Weak Skill Match
Requirement:
AI Engineer
Candidate Skills:
•	HTML
•	CSS
Expected Result:
•	Low compatibility score.
•	Candidate should not appear in the top five.
 
Test Case 3 — Existing Team Member
Condition:
Candidate is already part of the team.
Expected Result:
•	Candidate is excluded.
 
Test Case 4 — Previous Invitation
Condition:
Candidate already received an invitation.
Expected Result:
•	Candidate is excluded.
 
Test Case 5 — Availability Conflict
Condition:
Candidate has required skills but unavailable schedule.
Expected Result:
•	Lower compatibility score.
 
Test Case 6 — Role Mismatch
Required Role:
Backend Developer
Candidate Role:
UI/UX Designer
Expected Result:
•	Lower ranking.
 
Final Deliverables
At the end of the Teammate Recommendation AI task, the system should:
•	Finalize the teammate recommendation system.
•	Improve matching based on:

o	Skills
o	Interests
o	Availability
o	Experience level
o	Required role
•	Exclude users already in the team.
•	Exclude users who already received invitations.
•	Return the top five recommended teammates.
•	Generate compatibility scores.
•	Provide clear reasons for every recommendation.
•	Test recommendations using different user profiles.
•	Prepare structured output for backend integration.

