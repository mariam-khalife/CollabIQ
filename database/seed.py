"""Populate the CollabIQ database with sample data for local development and demos.

Usage:
    python database/seed.py

Reads DATABASE_URL from .env (or the environment). Safe to re-run: catalog rows
are matched by name and users by email, so existing rows are reused, not duplicated.
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

sys.path.insert(0, str(Path(__file__).resolve().parent))

from models import Interest, Role, Skill, Team, User, UserInterest, UserSkill  # noqa: E402

ROLES = [
    ("Frontend Developer", "Builds the user interface with React and Tailwind CSS"),
    ("Backend Developer", "Builds the FastAPI services and business logic"),
    ("Database Engineer", "Designs and maintains the PostgreSQL schema"),
    ("UI/UX Designer", "Designs screens, flows, and the overall user experience"),
    ("QA Engineer", "Tests features and guards release quality"),
    ("Team Lead", "Coordinates the team and owns delivery"),
]

SKILLS = [
    ("React", "Frontend"),
    ("Tailwind CSS", "Frontend"),
    ("JavaScript", "Frontend"),
    ("FastAPI", "Backend"),
    ("Python", "Backend"),
    ("JWT Authentication", "Backend"),
    ("PostgreSQL", "Database"),
    ("SQLAlchemy", "Database"),
    ("Figma", "UI/UX"),
    ("Wireframing", "UI/UX"),
    ("Pytest", "QA"),
    ("Manual Testing", "QA"),
]

INTERESTS = ["Fintech", "Healthcare", "Gaming", "Education", "E-commerce", "Social Impact"]

# (full_name, email, availability, experience_level, {skill: level}, [interests])
USERS = [
    ("Maya Haddad", "maya@example.com", "full_time", "advanced",
     {"React": "advanced", "Tailwind CSS": "advanced", "JavaScript": "intermediate"},
     ["Gaming", "E-commerce"]),
    ("Omar Fares", "omar@example.com", "part_time", "intermediate",
     {"React": "intermediate", "JavaScript": "intermediate", "Figma": "beginner"},
     ["Education"]),
    ("Rita Khoury", "rita@example.com", "full_time", "advanced",
     {"FastAPI": "advanced", "Python": "advanced", "JWT Authentication": "intermediate"},
     ["Fintech", "Healthcare"]),
    ("Karim Nassar", "karim@example.com", "part_time", "intermediate",
     {"Python": "intermediate", "FastAPI": "beginner", "PostgreSQL": "beginner"},
     ["Gaming"]),
    ("Lina Aoun", "lina@example.com", "full_time", "advanced",
     {"PostgreSQL": "advanced", "SQLAlchemy": "advanced", "Python": "intermediate"},
     ["Healthcare", "Education"]),
    ("Ziad Saab", "ziad@example.com", "part_time", "beginner",
     {"PostgreSQL": "beginner", "SQLAlchemy": "beginner"},
     ["E-commerce"]),
    ("Nour Chami", "nour@example.com", "full_time", "advanced",
     {"Figma": "advanced", "Wireframing": "advanced", "React": "beginner"},
     ["Social Impact", "Education"]),
    ("Tarek Mansour", "tarek@example.com", "full_time", "intermediate",
     {"Pytest": "intermediate", "Manual Testing": "advanced", "Python": "beginner"},
     ["Gaming", "Fintech"]),
    ("Dana Sleiman", "dana@example.com", "part_time", "intermediate",
     {"React": "intermediate", "Tailwind CSS": "intermediate", "Manual Testing": "beginner"},
     ["Healthcare"]),
    ("Hadi Awad", "hadi@example.com", "full_time", "beginner",
     {"JavaScript": "beginner", "Python": "beginner"},
     ["Social Impact"]),
]

DEMO_TEAM = ("Demo Team", "maya@example.com")


def get_or_create(db, model, defaults=None, **lookup):
    row = db.query(model).filter_by(**lookup).first()
    if row is None:
        row = model(**lookup, **(defaults or {}))
        db.add(row)
        db.flush()
        return row, True
    return row, False


def seed(db: Session) -> None:
    created = {"roles": 0, "skills": 0, "interests": 0, "users": 0, "teams": 0}

    for role_name, description in ROLES:
        _, was_created = get_or_create(db, Role, role_name=role_name, defaults={"description": description})
        created["roles"] += was_created

    skills_by_name = {}
    for name, category in SKILLS:
        skill, was_created = get_or_create(db, Skill, name=name, defaults={"category": category})
        skills_by_name[name] = skill
        created["skills"] += was_created

    interests_by_name = {}
    for name in INTERESTS:
        interest, was_created = get_or_create(db, Interest, name=name)
        interests_by_name[name] = interest
        created["interests"] += was_created

    users_by_email = {}
    for full_name, email, availability, experience_level, user_skills, user_interests in USERS:
        user, was_created = get_or_create(
            db,
            User,
            email=email,
            defaults={
                "full_name": full_name,
                # Not a real credential - sample accounts only. The backend's
                # register endpoint is what produces real bcrypt hashes.
                "password_hash": "sample-data-not-a-real-login",
                "availability": availability,
                "experience_level": experience_level,
            },
        )
        users_by_email[email] = user
        created["users"] += was_created
        if not was_created:
            continue
        for skill_name, level in user_skills.items():
            db.add(UserSkill(user_id=user.id, skill_id=skills_by_name[skill_name].id, proficiency_level=level))
        for interest_name in user_interests:
            db.add(UserInterest(user_id=user.id, interest_id=interests_by_name[interest_name].id))

    team_name, leader_email = DEMO_TEAM
    _, was_created = get_or_create(
        db, Team, team_name=team_name, defaults={"leader_id": users_by_email[leader_email].id}
    )
    created["teams"] += was_created

    db.commit()
    print("Seed complete:")
    for kind, count in created.items():
        print(f"  {kind}: {count} created")


if __name__ == "__main__":
    load_dotenv()
    url = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/collabiq")
    engine = create_engine(url)
    with Session(engine) as session:
        seed(session)
