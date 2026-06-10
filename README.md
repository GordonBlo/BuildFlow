# BuildFlow

**BuildFlow** is a full-stack construction project and finance management application designed for small construction teams.

The goal of the project is to manage projects, tasks, expenses, incomes, and dashboard summaries in one practical business application.

This is my main portfolio project, built to demonstrate backend architecture, authentication, protected routes, database logic, API testing, GitHub workflow, and AI-assisted development.

---

## Current Status

**Version: 0.8.0**

The backend currently supports authentication, protected user routes, project ownership validation, project creation, project listing, project detail view, project update, and project archiving.

---

## Implemented Features

### Backend

* FastAPI backend
* Professional backend folder structure
* SQLite database setup
* SQLAlchemy configuration
* User database model
* Project database model
* Password hashing with bcrypt
* JWT access token generation
* JWT token verification
* Protected current user endpoint
* User repository layer
* User service layer
* Project repository layer
* Project service layer
* Project ownership validation
* Project creation
* Project listing
* Project detail endpoint
* Project update endpoint
* Project archive endpoint
* Archived projects hidden by default
* Optional archived project listing with `include_archived=true`
* Health check endpoint
* Database health check endpoint

### Frontend

* React TypeScript frontend
* Vite setup
* Frontend connected to backend API
* Basic frontend/backend communication tested

---

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* JWT authentication
* bcrypt password hashing
* Uvicorn

### Frontend

* React
* TypeScript
* Vite
* HTML
* CSS

### Tools

* Git
* GitHub
* VS Code
* Swagger UI
* AI-assisted development workflow

---

## Backend Architecture

The backend follows a clean layered structure:

```text
backend/
└── app/
    ├── core/
    ├── models/
    ├── repositories/
    ├── routes/
    ├── schemas/
    ├── services/
    └── main.py
```

### Layer responsibilities

* `models` — database tables
* `schemas` — request and response validation
* `repositories` — direct database operations
* `services` — business logic
* `routes` — API endpoints
* `core` — database setup, security, authentication dependencies

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login and receive JWT token    |
| GET    | `/api/auth/me`       | Get current authenticated user |

### Projects

| Method | Endpoint                              | Description                                          |
| ------ | ------------------------------------- | ---------------------------------------------------- |
| POST   | `/api/projects`                       | Create a new project                                 |
| GET    | `/api/projects`                       | List current user's active projects                  |
| GET    | `/api/projects?include_archived=true` | List current user's projects including archived ones |
| GET    | `/api/projects/{project_id}`          | Get one project by ID                                |
| PATCH  | `/api/projects/{project_id}`          | Update a project                                     |
| PATCH  | `/api/projects/{project_id}/archive`  | Archive a project                                    |

### Health

| Method | Endpoint     | Description           |
| ------ | ------------ | --------------------- |
| GET    | `/health`    | Basic health check    |
| GET    | `/health/db` | Database health check |

---

## Latest Update — v0.8.0

BuildFlow v0.8.0 added project update and archive functionality.

Users can now update project fields such as:

* name
* description
* client name
* status
* budget
* start date
* deadline

Projects can also be archived instead of deleted. Archived projects are hidden from the normal project list by default, but they can still be retrieved with:

```text
GET /api/projects?include_archived=true
```

This improves the project lifecycle logic and brings the backend closer to a real project management application.

---

## Manual Testing

The v0.8.0 backend flow was tested through Swagger UI:

1. Register user
2. Login user
3. Authorize with JWT token
4. Create project
5. List projects
6. Get project details
7. Update project
8. Archive project
9. Verify archived project is hidden from normal project list
10. Verify archived project appears with `include_archived=true`

---

## AI-Assisted Development Workflow

This project is developed with an AI-assisted workflow.

AI tools are used for planning, code review, debugging support, and implementation guidance. Generated code is not accepted blindly. Each feature is reviewed, tested through Swagger UI, and committed only after it works correctly.

The workflow focuses on:

* understanding the architecture
* controlling generated code
* testing API behavior
* debugging step by step
* using Git and GitHub properly
* documenting implemented features

---

## Roadmap

### v0.9

* Task module
* Task creation
* Task listing
* Task ownership validation
* Task update and completion status

### v0.10

* Expense module
* Income module
* Project financial tracking

### v0.11

* Dashboard summary endpoint
* Project totals
* Expense and income summaries

### v1.0

* Backend MVP completion
* Full README documentation
* Final backend cleanup
* Frontend MVP integration

---

## Project Goal

BuildFlow is intended to become a practical full-stack portfolio project that demonstrates junior backend and full-stack development skills through a real business domain.

The project combines:

* backend API development
* authentication
* database modeling
* protected routes
* ownership validation
* project management logic
* AI-assisted development workflow
* React frontend integration

---

## Repository

https://github.com/GordonBlo/BuildFlow
