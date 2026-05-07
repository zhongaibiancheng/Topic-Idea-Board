# Topic-Idea-Board

Demo URL: https://schedule.jessyu.xyz

## Prerequisites

- **Node.js** >= 12 (for frontend)
- **Python** >= 3.9 (for backend)
- **MySQL** >= 5.7 (or MariaDB)
- **Redis** (for Celery tasks)

---

## Frontend Setup

```shell
cd frontend
yarn install
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```shell
# frontend/.env
VUE_APP_IP=http://localhost:5000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VUE_APP_IP` | Backend API base URL (protocol + host + port) | `http://localhost:5000` |

> The backend Flask dev server runs on port **5000** by default. If you change the backend port, update this value accordingly.

Start the frontend dev server:

```shell
yarn serve
```

---

## Backend Setup (Local Development, no Docker)

### 1. Create MySQL Database & User

```shell
mysql -u root -p
```

```sql
CREATE USER IF NOT EXISTS 'test'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE IF NOT EXISTS flask CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON flask.* TO 'test'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Database Connection

Copy the default config and edit it:

```shell
cd backend
cp config/reminder-config-default.json config/reminder-config.json
```

Edit `config/reminder-config.json` to match your MySQL settings:

```json
{
    "SQLALCHEMY_DATABASE_URI": "mysql://test:password@localhost/flask",
    "SECRET_KEY": "secretkey",
    "BASIC_AUTH_USERNAME": "John_Doe",
    "BASIC_AUTH_PASSWORD": "password"
}
```

> `reminder-config.json` is gitignored, so your local credentials won't be committed.

### 3. Install Python Dependencies

```shell
cd backend
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

### 4. Create Database Tables

```shell
cd backend
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Tables created successfully')
"
```

### 5. Start the Backend Server

```shell
cd backend
python app.py
```

The backend will start at `http://localhost:5000`.

---

## Tasks (Celery) Setup

```shell
cd tasks
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

Configure database and mail settings in `tasks/config/tasks-config.json` (copy from `tasks-config-default.json`).

---

## Quick Overview

### Config file loading order

**Backend** (`backend/config/`):
```
reminder-config.json          # Local (gitignored) — highest priority
reminder-config-default.json  # Default values
reminder-config-docker.json   # Docker-specific values — lowest priority
```

**Tasks** (`tasks/config/`):
```
tasks-config.json             # Local (gitignored) — highest priority
tasks-config-default.json     # Default values
tasks-config-docker.json      # Docker-specific values — lowest priority
```

## The framework Flask-Vue-Reminder used

- Backend：``Flask 2``
- Frontend：``Vue 3``

## Some used Flask plugins

- `flask-restx` => Using to create **API**
- `flask-sqlalchemy` => **ORM**
- `flask-marshmallow` => Turn **Object** to **JSON**

  - with `marshmallow-sqlalchemy`
- `mysqlclient` => communicate with **MySQL**

## Some used Vue pugins and framework

- vue-router@4.x => To create router for Vue
- vue-axios@3.x =>  To fetch the **API** from backend
- tailwindcss 2 => CSS framework

## Backend Structure

```markup-templating
├── backend
│   ├── Dockerfile
│   ├── app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apis
│   │   │   ├── __init__.py
│   │   │   ├── account_api.py
│   │   │   └── subjects_api.py
│   │   ├── models.py
│   │   └── schema.py
│   ├── app-local.ini
│   ├── app.ini
│   ├── app.py
│   ├── config
│   │   ├── reminder-config-default.json
│   │   ├── reminder-config-docker.json
│   │   └── reminder-config.json
│   ├── config.py
│   └── requirements.txt
```

``app.py``: Entry point of backend

``config.py``: config class import the config file from  ``config/``

``models.py``: **ORM** related (Using **Flask-SQLAlchemy**)

``schema.py``: **Flask-Marshmallow**

``app.ini`` and ``app-local.ini`` for ``uwsgi``.
- ``app.ini``: uses **socket** (for Docker/Production with nginx proxy)
- ``app-local.ini``: uses **http** (for local development, runs on port 5000)

``app/admin.py``: **Flask-Admin** settings

``app/apis``: **API** codes

## Frontend Structure

```markup-templating
├── frontend
│   ├── Dockerfile
│   ├── README.md
│   ├── nginx.conf
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.vue
│   │   ├── api
│   │   │   └── ip.js
│   │   ├── assets
│   │   │   ├── logo.png
│   │   │   └── tailwind.css
│   │   ├── components
│   │   │   └── Navbar.vue
│   │   ├── main.js
│   │   ├── router
│   │   │   └── index.js
│   │   └── views
│   │       ├── About.vue
│   │       ├── Create.vue
│   │       ├── Home.vue
│   │       └── Modify.vue
│   ├── tailwind.config.js
│   └── yarn.lock
```

``src/api``: **API** origin setting

``src/components``: the components

``src/views``: the pages

- ``About.vue`` => about page
- ``Create.vue`` => create new task page
- ``Home.vue`` => Home page, task page
- ``Modify.vue`` => modify page

# Tasks (Celery)

```markup-templating
 └── tasks
    ├── Dockerfile
    ├── celerybeat-schedule
    ├── config
    │   ├── tasks-config-default.json
    │   ├── tasks-config-docker.json
    │   └── tasks-config.json
    ├── config.py
    ├── mail.py
    ├── models.py
    ├── requirements.txt
    ├── schema.py
    └── tasks.py
```

- <mark>To watch the modification of the database</mark>
- To send the **Mail** to user
- Using **SQLAlchemy** to seize the data
- Mashmallow turn db Object to JSON format
- Celery check whether the data is due every minute

  1. After the program started, get the the data from database

     order by

     - done
     - reminding_date
     - reminding_time
  2. Turn the Object dat to  JSON format
  3. Using async function to check whther the data is due

     (1.) If the data is due, wrap the data to mail format then send to user

     (2.) Turn ``done`` field of data to True

     (3). Recatch the data from database
