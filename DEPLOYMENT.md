# Deploying CollabIQ

CollabIQ has three parts that deploy separately:

| Part      | Host   | Why |
|-----------|--------|-----|
| Frontend  | Vercel | Static Vite build, global CDN |
| Backend   | Render | FastAPI with no serverless time limit (the AI call takes ~17s) |
| Database  | Neon   | Managed PostgreSQL, free tier |

Deploy in this order: **Database → Backend → Frontend** (each needs the previous one's URL).

---

## 1. Database — Neon

1. Sign up at <https://neon.tech> and create a project (name it `collabiq`).
2. Copy the connection string it gives you. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxx.neon.tech/collabiq?sslmode=require
   ```
3. Change the scheme to the psycopg2 form used by this app — replace
   `postgresql://` with `postgresql+psycopg2://`:
   ```
   postgresql+psycopg2://USER:PASSWORD@ep-xxx.neon.tech/collabiq?sslmode=require
   ```
   Keep this string — it is the `DATABASE_URL` for the backend.

The tables are created automatically on the first backend deploy (the Render
build runs `alembic upgrade head`).

---

## 2. Backend — Render

1. Sign up at <https://render.com> and connect your GitHub account.
2. **New → Blueprint**, pick the `mariam-khalife/collabiq` repo. Render reads
   `render.yaml` and proposes a service called **collabiq-api**.
3. When prompted, fill in the environment variables:
   - `DATABASE_URL` → the Neon string from step 1.
   - `LLM_API_KEY` → your **new** Google Gemini key (rotate the old one first).
   - `FRONTEND_ORIGINS` → leave blank for now; set it after step 3 to your
     Vercel URL (e.g. `https://collabiq.vercel.app`).
   - `SECRET_KEY` → generated automatically, nothing to do.
4. Click **Apply**. The build installs dependencies and runs the migrations.
5. When it goes live, copy the service URL (e.g.
   `https://collabiq-api.onrender.com`). That is your backend base URL.

> Note: Render's free tier sleeps after inactivity, so the first request after
> a pause takes ~30s to wake up. Fine for a demo.

---

## 3. Frontend — Vercel

1. Sign up at <https://vercel.com> and import the `mariam-khalife/collabiq` repo.
2. Set **Root Directory** to `frontend`. Vercel auto-detects Vite
   (build `npm run build`, output `dist`).
3. Add one environment variable:
   - `VITE_API_BASE_URL` → your Render backend URL from step 2
     (e.g. `https://collabiq-api.onrender.com`).
4. Click **Deploy**. Copy the resulting URL (e.g. `https://collabiq.vercel.app`).

---

## 4. Connect the two (CORS)

1. Back in **Render → collabiq-api → Environment**, set:
   - `FRONTEND_ORIGINS` → your Vercel URL, e.g. `https://collabiq.vercel.app`
     (comma-separated if you have more than one).
2. Save — Render redeploys. The backend now accepts requests from the frontend.

Open the Vercel URL, register an account, and you're live.

---

## Environment variable reference

**Backend (Render):**

| Variable           | Example                                                        |
|--------------------|----------------------------------------------------------------|
| `DATABASE_URL`     | `postgresql+psycopg2://user:pass@ep-xxx.neon.tech/collabiq?sslmode=require` |
| `SECRET_KEY`       | (Render generates)                                             |
| `LLM_API_KEY`      | your Gemini key                                               |
| `FRONTEND_ORIGINS` | `https://collabiq.vercel.app`                                 |

**Frontend (Vercel):**

| Variable            | Example                              |
|---------------------|--------------------------------------|
| `VITE_API_BASE_URL` | `https://collabiq-api.onrender.com`  |
