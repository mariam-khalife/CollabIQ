from fastapi import FastAPI

from app.routers import auth

app = FastAPI(
    title="CollabIQ API",
    description="Backend API for the CollabIQ platform",
    version="1.0.0"
)

app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to CollabIQ Backend!"
    }