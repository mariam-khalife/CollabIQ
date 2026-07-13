PROJECT_RECOMMENDATION_PROMPT = """You are helping a student team on CollabIQ pick a project to build.

Team skills: {skills}
Team interests: {interests}
Team experience levels: {experience_levels}

Suggest exactly {count} project ideas that fit this team's combined skills, interests, and
experience. Match the ambition of each idea to the team's experience levels: a mostly
beginner team should get approachable projects, an advanced team can handle harder ones.

Respond with a JSON object of the form:
{{"projects": [{{"title": "...", "description": "...", "difficulty_level": "...",
"required_technologies": ["...", "..."], "confidence_score": 0.0}}]}}

Rules for each field:
- title must be at most 255 characters.
- difficulty_level must be exactly one of: {difficulty_values}.
- required_technologies is a list of short, concrete technology names the project needs
  (e.g. ["React", "FastAPI", "PostgreSQL"]), preferring ones the team already knows.
- confidence_score must be a number between 0.0 and 1.0 reflecting how well the idea
  fits the team's skills, interests, and experience.
"""
