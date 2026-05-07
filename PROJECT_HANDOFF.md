# PROJECT_HANDOFF.md — Topic-Idea-Board

## 1. Project Overview

**Topic-Idea-Board** is a full-stack web application that allows users to:
- Create "subjects" (topics/tasks) with details, page ranges, and reminder dates
- View and manage their subjects on a kanban-like board
- Receive email reminders when a subject's due date/time arrives
- Authenticate via Google OAuth (JWT-based session)

The project consists of three components: **Frontend** (Vue 3), **Backend** (Flask 2), and **Tasks** (Celery worker).

---

## 2. Current Status

| Area | Status |
|---|---|
| Frontend UI | Functional — 5 views implemented (Home, Create, Modify, Login, About) |
| Backend API | RESTful CRUD for subjects + account/auth endpoints |
| Authentication | Google OAuth login, JWT token handling |
| Celery Tasks | Scripts exist, configured for periodic due-date checking and email sending |
| Docker | All 3 components have Dockerfiles; nginx.conf for frontend production |
| Database Models | 3 tables: `User`, `Subjects`, `SubjectNames` |
| Production Config | uWSGI configs available (`app.ini` for socket/proxy, `app-local.ini` for dev) |
| Testing | No test files found in the project |
| CI/CD | Not configured |
| API Documentation | flask-restx auto-generates Swagger docs (unconfirmed if exposed) |

---

## 3. Directory Structure

```
Topic-Idea-Board/
│
├── AGENTS.md                       # <new> Agent instructions
├── PROJECT_HANDOFF.md              # <new> This file
├── TODO.md                         # <new> Task tracking
│
├── frontend/                       # Vue 3 SPA
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vue.config.js               # (unconfirmed existence)
│   ├── package.json
│   ├── yarn.lock
│   └── src/
│       ├── main.js                 # App entry point
│       ├── App.vue                 # Root component
│       ├── api/
│       │   └── ip.js               # API base URL configuration
│       ├── assets/
│       │   ├── tailwind.css
│       │   └── logo.png
│       ├── components/
│       │   └── Navbar.vue          # Navigation bar
│       ├── router/
│       │   └── index.js            # Routes: /, /about, /create, /modify/:id, /login
│       └── views/
│           ├── Home.vue            # Main board page (subject listing)
│           ├── Create.vue          # Create new subject
│           ├── Modify.vue          # Edit existing subject
│           ├── Login.vue           # Google OAuth login page
│           └── About.vue           # About page
│
├── backend/                        # Flask REST API
│   ├── Dockerfile
│   ├── app.py                     # Entry point
│   ├── app-local.ini              # uWSGI config (local dev, HTTP)
│   ├── app.ini                    # uWSGI config (production, socket)
│   ├── config.py                  # Config class (reads reminder-config.json)
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py            # Flask app factory (db, ma, cors, admin, JWT)
│       ├── models.py              # DB models: User, Subjects, SubjectNames
│       ├── schema.py              # Marshmallow schemas
│       ├── admin.py               # Flask-Admin panel setup
│       └── apis/
│           ├── __init__.py        # Blueprint + namespace registration
│           ├── subjects_api.py    # Subjects CRUD endpoints
│           └── account_api.py     # Auth endpoints (Google OAuth)
│
├── tasks/                          # Celery worker
│   ├── Dockerfile
│   ├── tasks.py                   # Celery app + periodic task definitions
│   ├── config.py                  # Tasks config reader
│   ├── models.py                  # DB models (standalone copy for Celery)
│   ├── schema.py                  # Marshmallow schemas
│   ├── mail.py                    # Email sending logic
│   └── requirements.txt
│
└── config/                         # (shared or root-level — unconfirmed)
```

---

## 4. Core Modules

### 4.1 Database Models (`backend/app/models.py`)

| Model | Fields | Notes |
|---|---|---|
| `User` | id, email (unique), name, picture | Google OAuth user |
| `Subjects` | id, subject_name, user_id (FK→User), pages, hw_detail, modify_time, reminding_time, reminding_date, done | Each task/item on the board |
| `SubjectNames` | id, subject_name (unique) | Enum-like lookup table for subject names |

### 4.2 Backend API (`backend/app/apis/`)

- **subjects_api.py**: CRUD operations for Subjects model. Likely uses flask-restx Resource classes.
- **account_api.py**: Handles Google OAuth login flow, JWT token generation/validation.

### 4.3 Frontend Router (`frontend/src/router/index.js`)

5 routes defined:
| Path | Component | Name | Notes |
|---|---|---|---|
| `/` | Home | Home | Main board |
| `/about` | About (lazy) | About | Info page |
| `/create` | Create | Create | New subject form |
| `/modify/:id` | Modify | Modify | Edit subject by ID |
| `/login` | Login | Login | Auth page |

### 4.4 Celery Tasks (`tasks/tasks.py`)

Reads all Subjects from DB ordered by (done, reminding_date, reminding_time). Periodically checks if any subject is due and sends email to the owner.

---

## 5. Completed Features

- [x] User can log in via Google OAuth (JWT)
- [x] User can create a subject with: name, pages, details, reminding date/time
- [x] User can view all their subjects on the home board
- [x] User can modify existing subjects
- [x] Backend Subjects CRUD API
- [x] Celery-based email reminder when subject is due
- [x] Docker setup for all 3 components
- [x] Flask-Admin backend management panel
- [x] CORS configured for local development
- [x] Tailwind CSS utility classes applied throughout the UI

---

## 6. Incomplete / Unconfirmed Items

### Unconfirmed
- **Auth flow details**: Login.vue implementation not reviewed — exact OAuth flow (redirect vs popup) unconfirmed
- **API response schemas**: Exact JSON shapes not verified
- **Swagger UI**: flask-restx generates Swagger, but it's unconfirmed whether the endpoint is exposed
- **vue.config.js**: May exist but not confirmed
- **Root-level config/**: There appears to be no root-level config directory (only backend/config/ and tasks/config/)

### Missing / Known Gaps
- **No tests**: No test runner or test files found
- **No CI/CD**: No GitHub Actions, GitLab CI, or similar
- **No linting for Python**: Backend has no flake8/ruff/black config
- **No pre-commit hooks**
- **No seed data / migration scripts**: Database schema must be created manually via Python shell
- **No .env.example**: Frontend `.env` is mentioned in README but no example file provided
- **Error handling**: Not reviewed — unclear if API returns consistent error formats
- **Input validation**: Not reviewed — unclear if server-side validation exists beyond SQLAlchemy constraints

---

## 7. Known Issues

- Backend `config.py` reads `./config/reminder-config.json` with a hardcoded relative path; must be run from `backend/` directory
- `basic_auth` is initialized twice in `app/__init__.py:19-20` (duplicate line, likely harmless but untidy)
- No pagination on subject listing — may become a performance issue with many subjects
- Database tables must be created manually — no automated migration at first run (unless Flask-Migrate is used explicitly)

---

## 8. Configuration Loading Priority

### Backend (`backend/config/`)
1. `reminder-config.json` (local, gitignored) — highest priority
2. `reminder-config-default.json` — defaults
3. `reminder-config-docker.json` — Docker-specific overrides — lowest priority

### Tasks (`tasks/config/`)
1. `tasks-config.json` (local, gitignored) — highest priority
2. `tasks-config-default.json` — defaults
3. `tasks-config-docker.json` — Docker-specific overrides — lowest priority
