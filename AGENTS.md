# AGENTS.md — Topic-Idea-Board

## Project Identity

- **Name**: Topic-Idea-Board
- **Type**: Full-stack Web Application (SPA + REST API)
- **Purpose**: A topic/idea kanban board where users create tasks with reminders, and get email notifications when tasks are due.

## Tech Stack

### Frontend
- **Language**: JavaScript (ES6+)
- **Framework**: Vue 3 (`^3.0.0`)
- **Router**: vue-router 4 (`^4.0.0-0`)
- **HTTP Client**: axios + vue-axios
- **CSS**: Tailwind CSS 2 (PostCSS 7 compat)
- **Build**: Vue CLI 4 (~4.5.0) / Webpack 4
- **Auth (client)**: jwt-decode for JWT token decoding

### Backend
- **Language**: Python >= 3.9
- **Framework**: Flask 2.0.2
- **ORM**: Flask-SQLAlchemy 2.5.1 + SQLAlchemy 1.4
- **Serialization**: flask-marshmallow + marshmallow-sqlalchemy
- **API**: flask-restx 0.5.1 (REST API + Swagger)
- **Auth**: Flask-JWT-Extended 4.3.1, Google OAuth (via google-auth)
- **Admin**: Flask-Admin 1.5.8 (bootstrap4 mode)
- **Database Driver**: mysqlclient 2.1.0
- **Migration**: Flask-Migrate + Alembic
- **CORS**: Flask-Cors
- **Production Server**: uWSGI

### Task Queue
- **Framework**: Celery 5.2.6 (with Redis as broker/backend)
- **Purpose**: Periodically check database for due tasks and send email reminders

### Databases
- **Primary**: MySQL >= 5.7 (or MariaDB)
- **Cache/Queue**: Redis (for Celery)

### Infrastructure
- **Container**: Docker (each component has its own Dockerfile)
- **Reverse Proxy**: Nginx (nginx.conf for frontend production)

## Start Commands

### Frontend Dev
```shell
cd frontend
yarn install
# Create frontend/.env with: VUE_APP_IP=http://localhost:5000
yarn serve
```

### Backend Dev
```shell
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Ensure MySQL is running and reminder-config.json is configured
cp config/reminder-config-default.json config/reminder-config.json
# Edit reminder-config.json with local MySQL credentials
python -c "from app import app, db; app.app_context().push(); db.create_all()"
python app.py
```

### Tasks (Celery)
```shell
cd tasks
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Configure tasks/config/tasks-config.json
```

### Build (Frontend)
```shell
cd frontend
yarn build
```

### Lint (Frontend)
```shell
cd frontend
yarn lint
```

## Code Conventions

- **Backend**: Flask-style blueprints, snake_case for Python, class-based models extending `db.Model`
- **Frontend**: Vue 3 SFC (Single File Components), Options API, PascalCase for component names
- **API Prefix**: `/api` (registered as blueprint in `app/__init__.py`)
- **Configuration**: JSON files in `backend/config/` and `tasks/config/`, loaded by `config.py`
- **Import Order**: Standard library → third-party → local

## File Modification Rules

### ALLOWED
- Markdown documentation files (AGENTS.md, PROJECT_HANDOFF.md, TODO.md, README.md)
- Configuration JSON files (except package.json, requirements.txt)
- Vue components in `frontend/src/views/` and `frontend/src/components/`
- Backend Python files in `backend/app/`
- Task Python files in `tasks/`

### NEVER MODIFY
- `frontend/package.json` — dependency versions
- `backend/requirements.txt` — dependency versions
- `tasks/requirements.txt` — dependency versions
- `yarn.lock` — lockfile
- `frontend/src/main.js` — app entry point (unless explicitly requested)

## Prohibited Actions

- Do NOT add new npm/pip dependencies without explicit user request
- Do NOT run `git commit`, `git push`, or any git mutation unless explicitly asked
- Do NOT modify `.gitignore` or git config
- Do NOT remove or overwrite the `config/reminder-config.json` (gitignored local config)
- Do NOT change database connection strings or hardcode credentials

## Testing

- No test framework detected in the project. Do NOT assume any specific test runner exists.
- If asked to run tests, ask the user what test command is available, and suggest adding it to this file.

## Environment Variables (Frontend)

| Variable | Description | Default |
|---|---|---|
| `VUE_APP_IP` | Backend API base URL (protocol + host + port) | `http://localhost:5000` |

## API Endpoints (unconfirmed — inferred from file structure)

- `GET /api/subjects` — list subjects
- `POST /api/subjects` — create subject
- `PUT /api/subjects/<id>` — update subject
- `DELETE /api/subjects/<id>` — delete subject
- Account/Login API — handles Google OAuth + JWT
