# TaskFlow — Task Management App

A small task management application with a Node.js + Express + MongoDB backend and a React + Vite frontend.

This repository contains two projects in the same repo:

- `backend/` — Express API, Mongoose models, JWT auth
- `client/` — React + Vite frontend

---

## Table of Contents

- Overview
- Features
- Tech stack
- Project structure
- Quick start
	- Backend
	- Client
- Environment variables
- API (endpoints + examples)
- Database schemas (summary)
- Development tips & scripts
- Troubleshooting
- Next steps / suggestions
- License & contact

---

## Overview

TaskFlow is a simple, secure task manager that allows users to register/login and create, update, list, and delete tasks. Each task is owned by a user and protected by JWT-based auth.

The frontend (React + Vite) consumes the backend REST API. The backend enforces authentication for task routes via a `protect` middleware that reads a Bearer token from the `Authorization` header.

## Features

- User registration and login (JWT)
- Create, read, update, delete (CRUD) user-specific tasks
- Task fields: name, date, status, description, priority, attachments (URLs)
- Protected API routes using `Authorization: Bearer <token>`

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), jsonwebtoken, bcryptjs
- Frontend: React, Vite, React Router
- Dev tools: eslint, vite

## Project structure

- `backend/`
	- `server.js` — application bootstrap
	- `config/db.js` — mongoose connection helper
	- `controllers/` — `authController.js`, `taskController.js`
	- `models/` — `User.js`, `Task.js`
	- `routes/` — `authRoutes.js`, `taskRoutes.js`
	- `middleware/authMiddleware.js` — JWT protect middleware

- `client/`
	- `src/context/AuthContext.jsx` — login/signup functions and token storage
	- `src/pages/*` — `HomePage`, `LoginPage`, `SignupPage`
	- `src/components/*` — UI components

## Quick start

Prerequisites:
- Node.js (16+ recommended)
- npm
- MongoDB (Atlas or local)

1) Backend

```powershell
cd backend
npm install
copy .env.example .env
# Edit backend/.env and provide a real MONGO_URI and JWT_SECRET
npm start
```

Notes:
- The server expects `PORT`, `MONGO_URI`, and `JWT_SECRET` in `backend/.env`; it will exit if any are missing.
- CORS in `server.js` is configured for `http://localhost:5173` (the default Vite dev port). Change it if you run the client on another origin.

2) Client

```powershell
cd client
npm install
npm run dev
```

The client uses `http://localhost:5000` as the default API base (see `client/src/context/AuthContext.jsx` and `client/src/pages/HomePage.jsx`). Update `API_BASE_URL` in those files if the backend is running on a different host/port.

## Environment variables

Add these to `backend/.env` (do not commit your real `.env` to git):

- `PORT` - port to run the server (e.g., `5000`)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret for signing JWT tokens

See `backend/.env.example` for a template.

## API

Base URL: `http://localhost:<PORT>` (default `5000` in examples)

Authentication

- POST `/api/auth/register`
	- Body: `{ name, email, password }`
	- Success: `201` and JSON `{ _id, name, email, role, token }`

- POST `/api/auth/login`
	- Body: `{ email, password }`
	- Success: `200` and JSON `{ _id, name, email, role, token }`

Tasks (protected — requires header `Authorization: Bearer <token>`)

- GET `/api/tasks`
	- Returns tasks for current user (200)

- POST `/api/tasks`
	- Body example: `{ name: string, date: ISODateString, status?: 'Pending'|'Not Done'|'Done' }`
	- Returns created task (201)

- PUT `/api/tasks/:id`
	- Body: partial update fields (e.g., `{ status: 'Done' }`)
	- Returns updated task (200)

- DELETE `/api/tasks/:id`
	- Deletes task if owned by user (200)

Example (curl) — login and use token:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"you@example.com","password":"yourpassword"}'

# Assuming you receive { token: "<JWT>" }, get tasks:
curl http://localhost:5000/api/tasks -H "Authorization: Bearer <JWT>"
```

## Database schemas (summary)

- User (fields):
	- `name` (String, required)
	- `email` (String, required, unique)
	- `password` (String, hashed)
	- `role` ('user' | 'admin')

- Task (fields):
	- `user` (ObjectId ref to User, required)
	- `name` (String, required)
	- `date` (Date, required)
	- `status` (enum: 'Pending' | 'Not Done' | 'Done')
	- `description` (String)
	- `priority` (enum: 'Low' | 'Medium' | 'High')
	- `attached_documents` (array of Strings — URLs/paths)

## Development tips & scripts

- Backend scripts (in `backend/package.json`):
	- `start` - run `node server.js` (added)
	- Consider adding `nodemon` and a `dev` script for auto-reload: `nodemon server.js`

- Client scripts (in `client/package.json`):
	- `dev` - `vite` (development)
	- `build` - `vite build`
	- `preview` - `vite preview`

To run both concurrently during development, you can add a root `package.json` and use `concurrently` or a PowerShell script.

## Troubleshooting

- Server exits immediately: verify that `backend/.env` has `PORT`, `MONGO_URI`, and `JWT_SECRET`.
- `401 Unauthorized` from client: ensure the token is in localStorage and the client sends `Authorization: Bearer <token>` header.
- CORS errors: update allowed origin in `backend/server.js`'s `corsOptions.origin`.

## Next steps / suggestions

- Add `nodemon` for backend dev.
- Add a root-level dev script to run both backend and client together.
- Add curl / Postman examples for each endpoint.
- Add tests (unit + integration) for critical routes.

## Contributing

Open an issue or submit a PR. Keep changes small, include tests where reasonable, and ensure the backend `.env` is never committed.

## License

Choose a license for your project (e.g., MIT) and add a `LICENSE` file if you plan to open-source it. This repository currently has no license file.

---

If you'd like, I can now:
- Add a `backend/dev` script using `nodemon` and install it as a dev dependency.
- Add a root-level `package.json` with a `dev` script to run both client and backend concurrently.
- Add example curl commands for every endpoint in a separate `docs/API.md` file.

Tell me which of these you'd like and I'll implement them.
