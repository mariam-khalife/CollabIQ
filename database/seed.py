"""Populate the CollabIQ database with sample data for local development and demos.

Usage:
    python database/seed.py

Reads DATABASE_URL from .env (or the environment). Safe to re-run: rows are
matched by their natural keys (name/email), so existing rows are reused and any
missing skills/interests are backfilled instead of duplicated.

Every sample user can log in with the demo password below - local development
only, never reuse it for real accounts.
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

sys.path.insert(0, str(Path(__file__).resolve().parent))

from models import Interest, Role, Skill, Team, User, UserInterest, UserSkill  # noqa: E402

# Same hashing scheme as backend/app/core/security.py, so sample accounts can
# actually log in through the real /auth/login endpoint.
DEMO_PASSWORD = "Demo123!"
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
    ("TypeScript", "Frontend"),
    ("Node.js", "Backend"),
    ("REST API Design", "Backend"),
    ("Docker", "DevOps"),
    ("Data Modeling", "Database"),
    ("User Research", "UI/UX"),
    ("Cypress", "QA"),
    ("Data Analysis", "Analytics"),
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
    ("Sara Chidiac", "sara@example.com", "full_time", "advanced",
     {"React": "advanced", "TypeScript": "advanced", "Tailwind CSS": "intermediate"},
     ["Fintech", "Education"]),
    ("Elie Haddad", "elie@example.com", "full_time", "advanced",
     {"FastAPI": "advanced", "Python": "advanced", "Docker": "intermediate"},
     ["E-commerce", "Fintech"]),
    ("Yara Abou Zeid", "yara@example.com", "full_time", "advanced",
     {"PostgreSQL": "advanced", "Data Modeling": "advanced", "SQLAlchemy": "intermediate"},
     ["Healthcare"]),
    ("Fadi Gerges", "fadi@example.com", "part_time", "intermediate",
     {"Cypress": "advanced", "Manual Testing": "advanced", "Pytest": "intermediate"},
     ["Gaming", "E-commerce"]),
    ("Nadia Rizk", "nadia@example.com", "full_time", "advanced",
     {"Figma": "advanced", "User Research": "advanced", "Wireframing": "intermediate"},
     ["Social Impact", "Healthcare"]),
    ("Jad Khalil", "jad@example.com", "part_time", "intermediate",
     {"React": "intermediate", "FastAPI": "intermediate", "PostgreSQL": "beginner"},
     ["Fintech"]),
    ("Rana Barakat", "rana@example.com", "full_time", "advanced",
     {"Python": "advanced", "REST API Design": "advanced", "JWT Authentication": "intermediate"},
     ["Education", "Healthcare"]),
    ("Bilal Osman", "bilal@example.com", "part_time", "intermediate",
     {"Docker": "advanced", "Node.js": "intermediate", "Python": "beginner"},
     ["E-commerce"]),
    ("Layal Fakhoury", "layal@example.com", "full_time", "advanced",
     {"JavaScript": "advanced", "React": "advanced", "Wireframing": "beginner"},
     ["Gaming", "Social Impact"]),
    ("Samer Daou", "samer@example.com", "part_time", "intermediate",
     {"Pytest": "advanced", "Data Analysis": "intermediate", "Manual Testing": "intermediate"},
     ["Fintech", "Healthcare"]),
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

    demo_password_hash = _pwd_context.hash(DEMO_PASSWORD)
    users_by_email = {}
    for full_name, email, availability, experience_level, user_skills, user_interests in USERS:
        user, was_created = get_or_create(
            db,
            User,
            email=email,
            defaults={
                "full_name": full_name,
                "password_hash": demo_password_hash,
                "availability": availability,
                "experience_level": experience_level,
            },
        )
        users_by_email[email] = user
        created["users"] += was_created
        # Backfill skills/interests even for users that already existed, so a
        # partially seeded database converges on the full sample data.
        for skill_name, level in user_skills.items():
            get_or_create(
                db,
                UserSkill,
                user_id=user.id,
                skill_id=skills_by_name[skill_name].id,
                defaults={"proficiency_level": level},
            )
        for interest_name in user_interests:
            get_or_create(db, UserInterest, user_id=user.id, interest_id=interests_by_name[interest_name].id)

    team_name, leader_email = DEMO_TEAM
    _, was_created = get_or_create(db, Team, team_name=team_name, leader_id=users_by_email[leader_email].id)
    created["teams"] += was_created

    db.commit()
    print("Seed complete:")
    for kind, count in created.items():
        print(f"  {kind}: {count} created")
    print(f'All sample users log in with the demo password "{DEMO_PASSWORD}" (local development only).')


if __name__ == "__main__":
    load_dotenv()
    url = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/collabiq")
    engine = create_engine(url)
    with Session(engine) as session:
        seed(session)
