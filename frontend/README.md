# BuildFlow frontend

This directory contains the BuildFlow v1.0.0 React and TypeScript application. It uses Vite for local development and production builds, React Router for navigation, and the shared API client in `src/api/apiClient.ts` for backend communication and JWT headers.

For the complete product overview, backend setup, architecture, and API reference, see the repository root [README](../README.md).

## Local development

From this directory in Windows PowerShell:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

The default frontend URL is <http://localhost:5173>. The example environment file points the frontend to the API at <http://127.0.0.1:8000>.

## Validation

```powershell
npm run build
npm run lint
```

Do not commit `node_modules`, `dist`, or the local `.env` file.
