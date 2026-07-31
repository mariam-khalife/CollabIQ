# CollabIQ 🤝

> **AI-Powered Project Team Builder & Collaboration Platform**

CollabIQ is a web-based platform that helps students build balanced teams, receive AI-powered teammate and project suggestions, and manage project execution through roadmaps, tasks, and notifications.

---

## 📌 Problem Statement

Students often struggle to find teammates with complementary skills, choose suitable project ideas, divide responsibilities, and track project progress. CollabIQ supports this process through intelligent recommendations and structured collaboration tools.

---

## ✨ Implemented Features

| Feature | Description |
|---|---|
| 👤 **Authentication** | User registration, login, JWT authorization, and authenticated profile access |
| 🧑‍💻 **User Profiles** | Manage skills, interests, availability, experience level, university, and bio |
| 🤝 **Team Management** | Create teams, invite users, accept or decline invitations, manage members, and track readiness |
| 🧠 **AI Teammate Suggestions** | Recommend suitable teammates based on skills, interests, availability, and experience |
| 💡 **AI Project Suggestions** | Generate project ideas based on the team’s combined profile and skills |
| ✅ **Project Selection** | Allow the team leader to select a recommended project for the team |
| 🗺️ **Roadmap Management** | Create and manage ordered project phases with dates, statuses, and progress |
| 📝 **Task Management** | Create, assign, update, retrieve, and delete project tasks |
| 🔔 **Notifications** | Notify users about invitations, task assignments, upcoming deadlines, and overdue tasks |
| 📊 **Dashboard** | Display user, team, project, and progress information in one place |
| 🏆 **Reputation Support** | Provide a foundation for tracking participation and accountability |

---

## ⚙️ System Workflow

```text
1. A user registers and creates a profile.
2. A team leader creates a team.
3. The leader receives AI teammate suggestions.
4. The leader sends invitations to suggested or selected users.
5. Users accept or decline the invitations.
6. The completed team generates AI project recommendations.
7. The leader selects one project.
8. The team creates and manages its roadmap.
9. Members create, assign, and update tasks.
10. Notifications inform users about invitations, assignments, and deadlines.
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Axios |
| **Backend** | Python, FastAPI, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL |
| **Migrations** | Alembic |
| **Authentication** | JWT |
| **AI Integration** | LLM API and rule-based recommendation logic |
| **Testing & API Tools** | Pytest, Swagger UI, Postman |
| **Collaboration** | GitHub, Jira, Notion |

---

## 📁 Project Structure

```text
CollabIQ/
├── ai/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── migrations/
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── database/
├── docs/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11 or later
- Node.js 18 or later
- PostgreSQL
- Git

### Backend Setup

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/collabiq_db
SECRET_KEY=YOUR_SECURE_JWT_SECRET
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

LLM_API_KEY=YOUR_AI_API_KEY
LLM_BASE_URL=YOUR_AI_BASE_URL
LLM_MODEL=YOUR_AI_MODEL
```

Do not commit `.env` or any real secret.

Run migrations:

```powershell
alembic upgrade head
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

After login, the access token is stored automatically and sent with protected API requests.

---

## ✅ Main Testing Checklist

- Registration and login
- Profile retrieval and update
- Team creation and management
- Invitations and responses
- AI teammate suggestions
- AI project generation and regeneration
- Project selection
- Roadmap phase CRUD
- Task CRUD and assignment
- Deadline and overdue notifications
- Leader and member permissions
- Frontend production build

Build the frontend:

```powershell
cd frontend
npm run build
```

---

## 👥 Team

| Name | Role |
|---|---|
| **Mariam Khalife** | Team Lead & Backend Developer |
| **Hikmat Noun** | Database & AI Developer |
| **Lara Bouezz** | AI Developer |
| **Nancy Mohammad** | Frontend Developer |
| **Reina** | Frontend Developer |
| **Salman** | Backend Support |

---

## 📚 Project Documentation

- **Sprint 1 Report:** Add Notion link
- **Sprint 2 Report:** Add Notion link
- **Sprint 3 Report:** Add Notion link
- **SRS / Documentation:** Add link
- **Jira Board:** Add link
- **Notion Workspace:** Add published link

---

## 🌿 Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable final version |
| `dev` | Integrated development branch |
| `feature/...` | Individual feature branches |

Use pull requests and avoid pushing directly to `main`.

---

## ⚠️ Known Limitations

- Saved and liked AI project suggestions are not persisted after refresh.
- Google login and forgot-password email delivery are optional.
- Automated test coverage is limited.
- Deployment is not finalized.
- The legacy `database/models` package contains an outdated SQLAlchemy relationship used by old constraint tests.

---

## 🔮 Future Improvements

- Persistent saved project suggestions
- Google authentication
- Forgot-password email workflow
- Real-time collaboration and chat
- Expanded automated testing
- Advanced reputation analytics
- Production deployment
- GitHub activity integration

---

## 📄 License

This project was developed as part of the TeckTalks internship program.
