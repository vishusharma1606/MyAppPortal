const baseUrl = '/api';

function setMessage(text, type = 'success') {
  const container = document.getElementById('message');
  if (!container) return;
  container.innerHTML = `<div class="flash ${type}">${text}</div>`;
}

async function request(url, options = {}) {
  const opts = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }
  const response = await fetch(url, opts);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

async function loadUserAndApps() {
  try {
    const data = await request(`${baseUrl}/user`);
    return data;
  } catch (err) {
    window.location.href = 'index.html';
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  try {
    await request(`${baseUrl}/login`, { method: 'POST', body: { username, password } });
    window.location.href = 'dashboard.html';
  } catch (err) {
    setMessage(err.message, 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value.trim();
  try {
    const data = await request(`${baseUrl}/register`, { method: 'POST', body: { username, password } });
    setMessage(data.message, 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  } catch (err) {
    setMessage(err.message, 'error');
  }
}

async function handleLogout() {
  try {
    await request(`${baseUrl}/logout`, { method: 'POST' });
  } finally {
    window.location.href = 'index.html';
  }
}

async function loadApplications(redirectTo) {
  const appsContainer = document.getElementById('apps-list');
  if (!appsContainer) return;
  const data = await loadUserAndApps();
  appsContainer.innerHTML = '';
  if (!data || !data.apps || data.apps.length === 0) {
    appsContainer.innerHTML = '<p>No applications yet.</p>';
    return;
  }
  data.apps.forEach((app) => {
    const item = document.createElement('div');
    item.className = 'app-item';
    item.innerHTML = `
      <div class="app-details">
        <strong>${app.name}</strong>
        <p>${app.description || 'No description provided.'}</p>
      </div>
      <div class="app-actions">
        <button class="delete-button" data-id="${app.id}">Remove</button>
      </div>
    `;
    appsContainer.appendChild(item);
  });
}

async function handleCreateApplication(event) {
  event.preventDefault();
  const name = document.getElementById('app-name').value.trim();
  const description = document.getElementById('app-description').value.trim();
  try {
    await request(`${baseUrl}/applications`, { method: 'POST', body: { name, description } });
    setMessage('Application created.', 'success');
    document.getElementById('application-form').reset();
    await loadApplications();
  } catch (err) {
    setMessage(err.message, 'error');
  }
}

async function handleDeleteApplication(event) {
  if (!event.target.matches('.delete-button')) return;
  const id = event.target.dataset.id;
  try {
    await request(`${baseUrl}/applications/${id}`, { method: 'DELETE' });
    await loadApplications();
  } catch (err) {
    setMessage(err.message, 'error');
  }
}

function setupPage() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    return;
  }
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    return;
  }
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
  const appForm = document.getElementById('application-form');
  if (appForm) {
    appForm.addEventListener('submit', handleCreateApplication);
  }
  const appsContainer = document.getElementById('apps-list');
  if (appsContainer) {
    appsContainer.addEventListener('click', handleDeleteApplication);
    loadApplications();
  }
}

window.addEventListener('DOMContentLoaded', setupPage);
