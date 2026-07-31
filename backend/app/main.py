from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    auth,
    users,
    teams,
    invitations,
    skills,
    interest,
    projects,
    roadmap,
    tasks,
    notifications,
    reputation,
    roles,
    teammate_recommendations,
    project_recommendations,
)
from app.models.project_recommendation import ProjectRecommendation
from app.core.config import settings


app = FastAPI(
    title="CollabIQ API",
    description="Backend API for the CollabIQ platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(teams.router)
app.include_router(teammate_recommendations.router)
app.include_router(project_recommendations.router)
app.include_router(invitations.router)
app.include_router(skills.router)
app.include_router(interest.router)
app.include_router(projects.router)
app.include_router(roadmap.router)
app.include_router(tasks.router)
app.include_router(notifications.router)
app.include_router(reputation.router)
app.include_router(roles.router)



@app.get("/")
def root():
    return {
        "message": "Welcome to CollabIQ Backend!"
    }