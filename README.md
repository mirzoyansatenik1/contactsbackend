# Contacts Backend API

Lightweight Node.js/Express backend for managing a user's contacts.

This repository provides a simple contacts API with authentication (JWT), user management, and CRUD operations for contacts. It's intended as a small demo or starting point for a personal contacts service.

## Features

- User signup and login with JWT authentication
- Protected contacts endpoints (create, read, update, delete)
- Minimal dependencies for quick local development

## Quick start

Prerequisites:

- Node.js (v16+ recommended)
- npm

Clone the repo and run locally:

```bash
cd /path/to/your/workspace
git clone https://github.com/mirzoyansatenik1/contactsbackend.git
cd contactsbackend
npm install

# (optional) set environment variables for this session
export JWT_SECRET="your-secret-here"
export PORT=3000

# start the server
npm start

# or directly
node app.js
```

The server will listen on the value of `PORT` (default: 3000).

## Environment variables

- `JWT_SECRET` — secret used to sign JWTs. Do not commit secrets to source control. If not set, the app may fall back to a default (not recommended for production).
- `PORT` — port the server listens on (default: 3000).

If your project later requires a database, add `DATABASE_URL` (or similar) and update the app configuration.

## API (example)

All endpoints that modify or access contacts are expected to be protected by a JWT. Include the token in the Authorization header as `Authorization: Bearer <token>`.

Auth:

- POST /auth/register — create a new user
	- body: { "name": string, "email": string, "password": string }
- POST /auth/login — authenticate and receive a token
	- body: { "email": string, "password": string }
	- response: { "token": "..." }

Contacts (protected):

- GET /contacts — list all contacts for the authenticated user
- POST /contacts — create a new contact
	- body example: { "name": "Alice", "email": "alice@example.com", "phone": "+1-555-0000" }
- GET /contacts/:id — get one contact
- PUT /contacts/:id — update a contact
- DELETE /contacts/:id — delete a contact

Example: login and create a contact with curl

```bash
# login
curl -X POST http://localhost:3000/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"you@example.com","password":"yourpassword"}'

# assuming you receive {"token":"<JWT>"}, create a contact
curl -X POST http://localhost:3000/contacts \
	-H 'Content-Type: application/json' \
	-H 'Authorization: Bearer <JWT>' \
	-d '{"name":"Bob","email":"bob@example.com","phone":"+1-555-1234"}'
```

Adjust paths above if your app exposes different prefixes (for example, `/api/auth` or `/api/contacts`).

## Security notes

- Keep `JWT_SECRET` out of version control. Use environment variables or a secrets manager for production.
- Add and commit a `.gitignore` that excludes `node_modules/`, `.env`, and other local files.

## Development tips

- Add a `.env` and use a library like `dotenv` if you want local `.env` support.
- Add basic tests for authentication flow and contacts CRUD.

## Contributing

Feel free to open issues or PRs. For small projects, include a short description of the change and a short manual test plan.

## License

This project is provided as-is. Add a license (for example, MIT) if you want to allow reuse.

---

If you'd like, I can:

- tailor the README to the exact endpoint names in your `app.js` (I can read it and adjust examples),
- add a `.gitignore` and `.env.example`, or
- create a small Postman collection / OpenAPI spec.

Tell me which of the above you'd like next.

