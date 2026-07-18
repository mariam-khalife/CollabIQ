from fastapi import FastAPI

from app.routers import auth, users, teams, invitations, notifications

app = FastAPI(
    title="CollabIQ API",
    description="Backend API for the CollabIQ platform",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(teams.router)
app.include_router(invitations.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to CollabIQ Backend!"
    }

