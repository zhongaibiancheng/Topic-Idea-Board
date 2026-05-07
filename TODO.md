# TODO.md — Topic-Idea-Board

> Priority levels: **P0** = Critical / blocking, **P1** = Important, **P2** = Nice to have

---

## P0 — Critical

- [ ] **Add automated tests**
  - No test framework or test files exist anywhere in the project
  - Need at minimum: API endpoint tests (backend), component smoke tests (frontend)
- [ ] **Add Python linting/formatting configuration**
  - No ruff, flake8, or black config detected
  - Should add `pyproject.toml` or `.flake8` with consistent rules

---

## P1 — Important

- [ ] **Fix duplicate `basic_auth` initialization**
  - `backend/app/__init__.py:19-20` initializes `BasicAuth(app)` twice — redundant
- [ ] **Add input validation to API endpoints**
  - Unconfirmed whether `subjects_api.py` validates request payloads before DB insertion
  - flask-restx supports request parsing via `reqparse` — ensure it's used consistently
- [ ] **Add pagination to subject listing**
  - `GET /api/subjects` likely returns all subjects — needs pagination for scalability
- [ ] **Create `.env.example` file for frontend**
  - README documents `VUE_APP_IP` but no `.env.example` file exists in `frontend/`
- [ ] **Create database seed script**
  - Currently tables must be created manually via Python shell
  - A `seed.py` script with sample data would speed up onboarding
- [ ] **Standardize API error responses**
  - Unconfirmed — ensure all API errors return consistent JSON format (e.g., `{"error": "...", "code": ...}`)

---

## P2 — Nice to Have

- [ ] **Add CI/CD pipeline**
  - No GitHub Actions or similar configured
  - Could add lint → test → build → Docker deploy pipeline
- [ ] **Add pre-commit hooks**
  - Would auto-format and lint code before commits
- [ ] **Add frontend unit tests**
  - Vue Test Utils + Vitest (or Jest) for component testing
- [ ] **Add loading states / skeletons to frontend**
  - Unconfirmed if loading indicators exist — likely needed for better UX
- [ ] **Add error boundaries / error toast notifications**
  - Unconfirmed — API errors may not be surfaced to users
- [ ] **Add dark mode support**
  - Tailwind CSS dark mode variant could be leveraged
- [ ] **Add subject filtering / sorting on home page**
  - Current board likely displays all subjects — search/filter would improve UX
- [ ] **Add database migration automation**
  - Flask-Migrate is installed but may need initialization + first migration revision
- [ ] **Review and clean up Docker configurations**
  - Verify Dockerfiles work end-to-end, add docker-compose.yml for one-command startup
- [ ] **Add health check endpoint**
  - `GET /api/health` for monitoring / Docker health checks
