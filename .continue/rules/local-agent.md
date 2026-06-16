---
name: Safe project coding rules
---

- Work only with files I explicitly attach with `@Files`, highlight, or name.
- Start complex tasks in Plan mode. Do not modify files during planning.
- Make the smallest patch that solves the task.
- Do not delete, rename, move, mass-format, or overwrite files without explicit approval.
- Do not change dependencies, database schema, authentication, authorization, or environment files unless explicitly requested.
- Do not read or expose `.env`, credentials, tokens, private keys, or secrets.
- Preserve the current project structure and coding conventions.
- For Python backend code, use type hints, explicit validation, clear exceptions, and pytest-compatible design.
- After editing, list every changed file and give the exact command needed to verify the result.
