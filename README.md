# CollabIQ 🤝

> **AI-Powered Project Team Builder & Collaboration Platform**

CollabIQ is a web-based platform that helps students transform individual skills into balanced project teams, generate project ideas, and manage project execution in a structured and intelligent way.

---

## 📌 Problem Statement

Students in academic environments often struggle to:

- Find the right teammates
- Build balanced teams with complementary skills
- Choose suitable project ideas
- Organize and assign tasks effectively
- Maintain team structure throughout development

CollabIQ automates and improves this process using intelligent matching and structured project workflows.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 👤 **User Profiles** | Students create profiles with skills, experience level, interests, and availability |
| 🤝 **Smart Team Matching** | Automatically forms balanced teams based on skill compatibility and project requirements |
| 🎭 **Role Assignment** | Assigns roles (backend, frontend, database, UI/UX, QA) based on user skills |
| 📊 **Project Readiness Score** | Evaluates team preparedness as a percentage score based on skill coverage |
| 🧠 **AI Project Recommendations** | Suggests project ideas based on available skills and team composition |
| 📅 **AI Roadmap Generator** | Generates structured project plans with phases, milestones, and development steps |
| 📝 **Task Management** | Breaks projects into assignable, trackable tasks |
| 🏆 **Reputation System** | Tracks participation and encourages accountability |

---

## ⚙️ System Workflow

```
1. User creates a profile with skills and interests
2. User joins or creates a project
3. System matches users into balanced teams
4. Roles are assigned automatically
5. Project Readiness Score is calculated
6. AI suggests project ideas and a roadmap
7. Team manages tasks and tracks progress
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, FastAPI |
| **Database** | PostgreSQL |
| **Frontend** | React, Tailwind CSS |
| **AI Features** | LLM API integration |
| **Core Logic** | Rule-based recommendation engine |
| **Authentication** | JWT |
| **Deployment** | Docker *(optional)* |

---

## 👥 Team

| Name | Role |
|---|---|
| Mariam Khalife | Team Lead |
| Boudiab-101 | Matching & Logic / AI Engineer|
| Lara-bouezz | Frontend Developer |
| Nancy-Mohammad | Database Engineer |
| HIKMAT-NOUN | Backend Lead  |

---

## 📁 Project Structure

```
techtalks-collabiq/
├── backend/        # FastAPI app — routes, auth, business logic
├── frontend/       # React + Tailwind CSS
├── database/       # PostgreSQL schema and migrations
└── docs/           # Architecture diagrams, API docs
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌿 Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only |
| `dev` | Active development — all PRs merge here |
| `feature/xxx` | Individual feature branches |

> ⚠️ Never push directly to `main`. Always open a pull request to `dev`.

---

## 🔮 Future Improvements

- Advanced analytics dashboard
- Real-time chat system
- AI project risk detection
- GitHub integration for task tracking

---

