# SecureAuth – React + MongoDB Authentication System

A complete, full-stack authentication application built with React.js (Vite) on the frontend and Node.js/Express on the backend, with MongoDB for data persistence.

## Features

- User Registration with bcrypt password hashing
- User Login with JWT authentication
- Protected routes (accessible only after login)
- Logout functionality
- Form validation (frontend + backend)
- Professional, responsive UI with Peacock Blue theme
- Secure credential storage (no plain-text passwords)

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router DOM v6, Axios |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB, Mongoose                   |
| Auth      | bcryptjs, JSON Web Tokens (JWT)     |
| Styling   | Plain CSS                           |

## Project Structure

```
secure-auth/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/
│   │   └── authController.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
└── README.md
```

## MongoDB Setup

### Option 1 – Local MongoDB
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service: `mongod`
3. The database `secureauth` will be created automatically on first user registration.
4. Default connection: `mongodb://localhost:27017/secureauth`

### Option 2 – MongoDB Atlas (Cloud)
1. Create a free cluster at https://cloud.mongodb.com
2. Get your connection string from the cluster dashboard.
3. Replace `MONGO_URI` in `server/.env` with your Atlas connection string.

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/secureauth
JWT_SECRET=your_secure_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

## Installation

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## Running the Application

### Start the Backend
```bash
cd server
npm run dev
```
Backend runs at http://localhost:5000

### Start the Frontend
```bash
cd client
npm run dev
```
Frontend runs at http://localhost:5173

Open your browser and navigate to http://localhost:5173

## API Endpoints

| Method | Endpoint              | Description                     | Auth Required |
|--------|-----------------------|---------------------------------|---------------|
| POST   | /api/auth/register    | Register a new user             | No            |
| POST   | /api/auth/login       | Login with email & password     | No            |
| GET    | /api/auth/me          | Get current user info           | Yes (Bearer)  |

## Authentication Flow

1. **Register**: User submits name, email, password → backend validates, hashes password with bcrypt, saves to MongoDB → returns success message.
2. **Login**: User submits email, password → backend finds user, compares bcrypt hash → issues a JWT (7-day expiry) → frontend stores token in localStorage.
3. **Protected Route**: `ProtectedRoute` component checks localStorage for a valid token → redirects to `/login` if absent.
4. **Logout**: Frontend removes token and user data from localStorage → redirects to `/login`.

## Screenshots

> _Add screenshots here after running the application._

---

Built as an academic demonstration of full-stack authentication with React and MongoDB.
