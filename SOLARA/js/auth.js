const AUTH_API_BASE = window.location.origin;

function setAuthMessage(text, type = 'success') {
  const msg = document.getElementById('authMsg');
  if (!msg) return;
  msg.textContent = text;
  msg.className = `auth-message ${type}`;
}

async function signupUser(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone?.value.trim(),
    password: form.password.value,
  };

  try {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed.');
    localStorage.setItem('solara_user', JSON.stringify(data.user));
    setAuthMessage('Account created. Redirecting...', 'success');
    setTimeout(() => window.location.href = 'solara.html', 700);
  } catch (error) {
    setAuthMessage(error.message, 'error');
  }
}

async function loginUser(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  try {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed.');
    localStorage.setItem('solara_user', JSON.stringify(data.user));
    setAuthMessage('Login successful. Redirecting...', 'success');
    setTimeout(() => window.location.href = 'solara.html', 700);
  } catch (error) {
    setAuthMessage(error.message, 'error');
  }
}
