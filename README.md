# BuildFlow v1.0.0

## Live Demo

[Open BuildFlow Demo](https://gordonblo.github.io/BuildFlow/#/demo/dashboard)
##

BuildFlow is a full-stack construction project and task management application. It combines a FastAPI backend, a React and TypeScript frontend, a local SQLite database, and JWT authentication in one responsive workspace.

## Product overview

BuildFlow helps authenticated users organize construction Projects and their Tasks while keeping every user's data isolated. The v1.0.0 release includes account management, Project and Task workflows, archiving, and an authenticated Dashboard summary.

### Technology stack

- FastAPI and Pydantic
- SQLAlchemy with SQLite
- JWT authentication and bcrypt password hashing
- React, TypeScript, and Vite
- Responsive CSS without an external UI library

## Authentication

- Register with a username, email address, and password.
- Log in to receive a one-hour JWT access token.
- Persist the JWT in browser local storage and restore the session on reload.
- Protect authenticated frontend routes.
- Load the current user from `GET /api/auth/me`.
- Log out by removing the persisted token and clearing authentication state.
- Restrict Projects, Tasks, and Dashboard aggregates to the authenticated owner.

## Projects

Authenticated users can list, create, view, and partially update their own Projects. Project status is validated against these canonical values:

- `planned`
- `active`
- `completed`

Archiving is separate from status through `is_archived`. Projects can be archived and unarchived, archived Projects are hidden from the default list, and `include_archived=true` includes them in the API listing. Archived Projects and their existing Tasks remain readable, but general Project edits and Task mutations are blocked until the Project is unarchived.

## Tasks

Tasks are scoped to a Project owned by the authenticated user. BuildFlow supports Project-scoped listing, creation, detail data, partial updates, and a dedicated Complete action.

Task statuses:

- `todo`
- `in_progress`
- `done`

Task priorities:

- `low`
- `medium`
- `high`

Descriptions and due dates are optional. Tasks belonging to archived Projects remain readable, while creation, updates, and completion are blocked.

## Dashboard

The authenticated Dashboard summarizes only data owned by the current user. It displays:

- total, planned, active, completed, and archived Project counts
- total budget across all owned Projects
- total, to-do, in-progress, and done Task counts
- current-user account information
- backend health and API version

Project totals and budget include active and archived Projects. Task totals also include Tasks retained by archived Projects.

## Frontend

The React application provides:

- a responsive authenticated layout with sidebar navigation and a shared header
- desktop and mobile support
- loading, error, retry, and empty states
- Project creation and partial-update forms
- Task creation and partial-update forms
- dedicated Project archive, Project unarchive, and Task completion actions
- centralized API and authentication handling

## Interactive portfolio demo

BuildFlow includes a browser-only portfolio demo at `/demo`. It uses realistic
sample Projects and Tasks, supports the main Project and Task workflows, and
recalculates the Dashboard as data changes. Demo changes persist in local
storage and can be restored at any time with **Reset demo data**. The demo does
not require an account, backend, database, JWT, or frontend environment file.

For local development, run `npm run dev` in `frontend` and open
<http://localhost:5173/demo>. To create the GitHub Pages-compatible static demo,
run `npm run build:demo`; Vite writes the hash-routed build to
`frontend/dist-demo` with the `/BuildFlow/` base path. The regular `npm run build`
output and authenticated application behavior remain unchanged.

## Architecture

The backend follows this request flow:

```text
route -> service -> repository -> database
```

- Routes define HTTP endpoints, dependencies, status codes, and response models.
- Services coordinate ownership checks and business rules.
- Repositories perform SQLAlchemy queries and persistence.
- Models and schemas define database records and validated API data.
- Core modules provide database setup and authentication dependencies.

The frontend follows this flow:

```text
page/component -> API module -> shared API client -> FastAPI
```

Pages and components own UI state, feature API modules define typed requests, and the shared API client applies the configured base URL, JWT header, response parsing, and readable API errors.

## Local installation

### Prerequisites

- Python 3.10 or newer
- Node.js 20.19 or newer, or Node.js 22.12 or newer
- Git

### Backend

From the repository root in Windows PowerShell:

```powershell
Set-Location .\backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

$secretBytes = New-Object byte[] 32
$randomNumberGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$randomNumberGenerator.GetBytes($secretBytes)
$randomNumberGenerator.Dispose()
$env:BUILDFLOW_SECRET_KEY = [Convert]::ToBase64String($secretBytes)

python -m uvicorn app.main:app --reload
```

`BUILDFLOW_SECRET_KEY` is required to sign and verify JWTs. Set it in every terminal or deployment environment that starts the API, and keep the value private and stable for as long as issued tokens should remain valid.

The backend creates `backend/buildflow.db` automatically when started from the `backend` directory.

### Frontend

In a second Windows PowerShell terminal, from the repository root:

```powershell
Set-Location .\frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

The example environment file configures `VITE_API_BASE_URL=http://127.0.0.1:8000`. Change the local `.env` value when the API runs at another address.

### Local URLs

- Frontend: <http://localhost:5173>
- API: <http://127.0.0.1:8000>
- Swagger UI: <http://127.0.0.1:8000/docs>

Do not commit `.venv`, `node_modules`, local `.env` files, or the local SQLite database. These paths and file types are excluded by the repository ignore rules.

### Existing local databases

New data accepts only the canonical Project statuses. For a pre-v1.0 local database containing known legacy Project status values, review and run the one-time utility manually from the repository root:

```powershell
.\backend\.venv\Scripts\python.exe .\backend\scripts\normalize_project_statuses.py
```

The script prints distinct values and affected counts first, aborts without changes when it finds an unknown value, and is safe to run again after normalization. It is never run automatically during application startup.

## API overview

Authentication, Project, Task, and Dashboard endpoints require JWT authentication except for registration and login. Health endpoints and the API root are public.

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Load the current authenticated user |

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/projects` | Create a Project |
| `GET` | `/api/projects` | List owned, non-archived Projects |
| `GET` | `/api/projects?include_archived=true` | List all owned Projects |
| `GET` | `/api/projects/{project_id}` | Get an owned Project |
| `PATCH` | `/api/projects/{project_id}` | Partially update a non-archived Project |
| `PATCH` | `/api/projects/{project_id}/archive` | Archive a Project |
| `PATCH` | `/api/projects/{project_id}/unarchive` | Unarchive a Project |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/projects/{project_id}/tasks` | Create a Task in an owned Project |
| `GET` | `/api/projects/{project_id}/tasks` | List a Project's Tasks |
| `GET` | `/api/projects/{project_id}/tasks/{task_id}` | Get Task detail data |
| `PATCH` | `/api/projects/{project_id}/tasks/{task_id}` | Partially update a Task |
| `PATCH` | `/api/projects/{project_id}/tasks/{task_id}/complete` | Mark a Task as `done` |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard/summary` | Get the authenticated user's Project, budget, and Task summary |

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Get API entry-point links |
| `GET` | `/health` | Get API health and version |
| `GET` | `/health/db` | Verify the database connection |
