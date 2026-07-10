T1 – Functional Requirements
Functional requirements specify what the CollabIQ system must do.
User Profile Management
• FR1: The system shall allow students to register and log in securely.
• FR2: The system shall allow users to create and update their profiles.
• FR3: The system shall store each user’s skills, experience level, interests, and
availability.
Project Management
• FR4: The system shall allow users to create a new project.
• FR5: The system shall allow users to join an existing project.
Team Formation
• FR6: The system shall automatically form balanced teams based on users’ skills and
project requirements.
• FR7: The system shall assign project roles (Backend, Frontend, Database, UI/UX, QA)
according to users’ skills.
AI Features
• FR8: The system shall calculate a Project Readiness Score for each team.
• FR9: The system shall recommend project ideas based on team skills.
• FR10: The system shall generate an AI-based project roadmap with phases, milestones,
and development steps.
Task Management
• FR11: The system shall create and assign project tasks.
• FR12: The system shall allow users to update task progress.
• FR13: The system shall display project progress to team members.
Reputation System
• FR14: The system shall maintain a reputation score for each user based on participation.
Security
• FR15: The system shall authenticate users using JWT before allowing access to protected
features.
T2 – User Stories
1. 2. As a student, I want to create an account so that I can use the platform.
As a student, I want to build my profile by adding my skills, interests, experience
level, and availability so that the system can recommend suitable teams.
3. As a student, I want to create or join a project so that I can collaborate with other
students.
4. As a student, I want the system to automatically match me with compatible
teammates so that our team has balanced skills.
5. As a student, I want the system to assign me a role based on my skills so that I can
contribute effectively.
6. As a team member, I want to view AI-generated project ideas so that my team can
choose an appropriate project.
7. As a team member, I want an AI-generated project roadmap so that I know the
project’s milestones and development phases.
8. As a team member, I want to see my team’s Project Readiness Score so that I know
whether our team has the required skills.
9. As a team member, I want to receive assigned tasks and update their status so that
everyone can track project progress.
10. As a student, I want my contributions to increase my reputation score so that my
participation is recognized.
T3 – System Actors
Actor Description Main Responsibilities
Student Primary user
of the system
Register, log in, manage profile, create/join projects,
receive role assignments, complete tasks, view
recommendations and readiness score
Team
Member
Student
participating
in a project
Collaborate with teammates, complete assigned tasks,
update progress
AI
Recommend
ation Engine
Intelligent
system
component
Match teams, assign roles, recommend projects, generate
roadmaps, calculate readiness scores
Actor Authenticati
on System
(JWT)
Description Security
component
Main Responsibilities
Authenticate users and authorize access to protected
resources