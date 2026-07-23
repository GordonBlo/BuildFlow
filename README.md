# BuildFlow

**BuildFlow** is a full-stack construction project and finance management application designed for small construction teams.

The goal of the project is to manage projects, tasks, expenses, incomes, and dashboard summaries in one practical business application.

This is my main portfolio project, built to demonstrate backend architecture, authentication, protected routes, database logic, API testing, GitHub workflow, and AI-assisted development.

---

## Current Status

**Version: 0.9.0**

The backend currently supports authentication, protected user routes, project ownership validation, project management, project archiving, and authenticated Task management within Projects.

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
* Task database model
* Task repository layer
* Task service layer
* Project ownership validation
* Project creation
* Project listing
* Project detail endpoint
* Project update endpoint
* Project archive endpoint
* Archived projects hidden by default
* Optional archived project listing with `include_archived=true`
* Tasks linked to Projects
* Task creation
* Task listing by project
* Task detail endpoint
* Partial Task update
* Task completion endpoint
* Task access protected by project ownership
* Archived projects are read-only while their Tasks remain readable
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

### Tasks

All Task endpoints require JWT authentication. Tasks belong to Projects and are accessible only through Projects owned by the current user.

| Method | Endpoint                                            | Description                                  |
| ------ | --------------------------------------------------- | -------------------------------------------- |
| POST   | `/api/projects/{project_id}/tasks`                  | Create a Task for a Project                  |
| GET    | `/api/projects/{project_id}/tasks`                  | List Tasks for a Project                     |
| GET    | `/api/projects/{project_id}/tasks/{task_id}`        | Get one Task by ID                           |
| PATCH  | `/api/projects/{project_id}/tasks/{task_id}`        | Partially update a Task                      |
| PATCH  | `/api/projects/{project_id}/tasks/{task_id}/complete` | Mark a Task as `done`                      |

Task status values are `todo`, `in_progress`, and `done`. Task priority values are `low`, `medium`, and `high`. A due date is optional.

Task creation, update, and completion are blocked for archived Projects because archived Projects are read-only. Tasks in archived Projects can still be listed and viewed. Invalid status or priority values are rejected by Pydantic validation.

### Health

| Method | Endpoint     | Description           |
| ------ | ------------ | --------------------- |
| GET    | `/health`    | Basic health check    |
| GET    | `/health/db` | Database health check |

---

## Latest Update - v0.9.0

BuildFlow v0.9.0 added the Task module.

Authenticated users can now create Tasks within their own Projects, list a Project's Tasks, view Task details, partially update Tasks, and mark Tasks as complete. Each Task supports:

* a required title
* an optional description
* status values of `todo`, `in_progress`, or `done`
* priority values of `low`, `medium`, or `high`
* an optional due date

Project ownership protects every Task endpoint. Archived Projects and their Tasks remain readable, but Task creation, updates, and completion are blocked because archived Projects are read-only. Pydantic validation rejects unsupported status and priority values.

---

## Manual Testing

The v0.9.0 backend flow was tested through Swagger UI:

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
11. Create a Task for a Project
12. List Tasks by Project
13. Get Task details
14. Partially update a Task
15. Mark a Task as complete
16. Verify another user's Project Tasks are inaccessible
17. Verify archived Project Tasks remain readable
18. Verify archived Project Tasks cannot be created, updated, or completed
19. Verify invalid Task status and priority values are rejected

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

### v0.9.0 - Complete

* Task module
* Task creation
* Task listing and detail
* Partial Task update
* Task completion
* Project ownership protection
* Archived Project read-only rules

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
