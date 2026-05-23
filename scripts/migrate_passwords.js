const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

function isProbablyHashed(pw) {
  return typeof pw === 'string' && pw.startsWith('$2');
}

function migrate() {
  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw || '{}');
  db.users = db.users || [];
  let changed = false;
  db.users = db.users.map((u) => {
    if (!u.password) return u;
    if (isProbablyHashed(u.password)) return u;
    const hashed = bcrypt.hashSync(u.password, 10);
    changed = true;
    return { ...u, password: hashed };
  });
  if (changed) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Passwords migrated and saved to', dbPath);
  } else {
    console.log('No plaintext passwords found. Nothing to do.');
  }
}

migrate();
