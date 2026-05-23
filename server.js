const express = require('express');
const session = require('express-session');
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const dbFile = path.join(__dirname, 'data', 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [], applications: [] });
const bcrypt = require('bcryptjs');

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

async function prepareDb() {
  await db.read();
  db.data = db.data || { users: [], applications: [] };
  await db.write();
}

prepareDb();

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

app.get('/api/user', requireAuth, async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === req.session.userId);
  const apps = db.data.applications.filter((app) => app.user_id === req.session.userId);
  res.json({ user: { id: user.id, username: user.username }, apps });
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Provide username and password' });
  await db.read();
  const existing = db.data.users.find((u) => u.username === username);
  if (existing) return res.status(400).json({ error: 'User already exists' });
  const id = db.data.users.length ? Math.max(...db.data.users.map((u) => u.id)) + 1 : 1;
  const hashed = bcrypt.hashSync(password, 10);
  db.data.users.push({ id, username, password: hashed });
  await db.write();
  return res.json({ message: 'Account registered successfully. Please login.' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Provide username and password' });
  await db.read();
  const user = db.data.users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  req.session.userId = user.id;
  return res.json({ message: 'Login successful.' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

app.get('/api/applications', requireAuth, async (req, res) => {
  await db.read();
  const apps = db.data.applications.filter((app) => app.user_id === req.session.userId);
  res.json({ apps });
});

app.post('/api/applications', requireAuth, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  await db.read();
  const id = db.data.applications.length ? Math.max(...db.data.applications.map((a) => a.id)) + 1 : 1;
  db.data.applications.push({ id, user_id: req.session.userId, name, description: description || '' });
  await db.write();
  res.json({ message: 'Application created.' });
});

app.delete('/api/applications/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await db.read();
  db.data.applications = db.data.applications.filter((app) => !(app.id === id && app.user_id === req.session.userId));
  await db.write();
  res.json({ message: 'Application removed.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
