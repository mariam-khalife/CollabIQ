PROJECT_RECOMMENDATION_PROMPT = """You are helping a student team on CollabIQ pick a project to build.

Team skills: {skills}
Team interests: {interests}

Suggest exactly {count} project ideas that fit this team's combined skills and interests.
Respond with a JSON object of the form:
{{"projects": [{{"title": "...", "description": "...", "confidence_score": 0.0}}]}}
confidence_score must be a number between 0.0 and 1.0 reflecting how well the idea fits the
team's skills and interests.
"""
