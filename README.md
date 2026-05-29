# PawPrint

A full-stack web application featuring a React-based frontend and an Express-based Node.js backend using PostgreSQL.

## Project Structure

The repository is divided into two main parts: the frontend and the backend.

### `frontend`
A React application set up using Vite.
- **Framework**: React, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

To run the frontend during development:
```sh
cd frontend
npm install
npm run dev
```

### `backend`
An Express API server interacting with a PostgreSQL database.
- **Framework**: Express, Node.js
- **Database**: PostgreSQL (via `pg`)
- **Middlewares**: CORS, dotenv

To run the backend during development:
```sh
cd backend
npm install
npm run dev
```

## Setup Instructions

1. Clone the repository.
2. Ensure you have Node.js and PostgreSQL installed.
3. Configure your database connections using environmental variables (see `backend/.env` for configuration if applicable).
4. Follow the local run instructions for both frontend and backend above.
