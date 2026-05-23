# Simple Auth App

Minimal Node.js + Express app with separate static frontend and backend API, using SQLite for persistent user and application data.

Setup

1. Install dependencies

```bash
npm install
```

2. Start server

```bash
npm start
```

3. Open http://localhost:5000

Notes

- This app now stores users and applications in `data/app.db` using SQLite.
- The frontend is in `frontend/` and is served as static files. The backend API is in `server.js`.
- Data persists across restarts, unlike the old in-memory version.
- For production, add password hashing and a stronger session store.
