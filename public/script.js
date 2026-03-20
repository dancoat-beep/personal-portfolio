// Dark mode toggle
const toggle = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = saved || (prefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);

toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Contact form
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const name = data.get('name').trim();
  const email = data.get('email').trim();
  const message = data.get('message').trim();

  if (!name || !email || !message) {
    status.textContent = 'Please fill in all fields.';
    return;
  }

  status.textContent = 'Sending...';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const result = await res.json();

    if (res.ok) {
      status.textContent = result.message;
      form.reset();
    } else {
      status.textContent = result.error || 'Something went wrong.';
    }
  } catch (err) {
    status.textContent = 'Failed to send. Please try again.';
  }
});
