// ─── Dark mode toggle ───
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

// ─── Active nav link on scroll ───
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -60% 0px' }
);

sections.forEach((section) => navObserver.observe(section));

// ─── Vimeo thumbnails (via oEmbed) ───
document.querySelectorAll('img[data-vimeo-thumb]').forEach(async (img) => {
  const id = img.dataset.vimeoThumb;
  try {
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1280`);
    if (!res.ok) throw new Error('oEmbed failed');
    const data = await res.json();
    // Request a larger version of the thumbnail
    const url = data.thumbnail_url.replace(/_\d+x\d+/, '_1280x720');
    img.src = url;
  } catch (err) {
    console.warn('Vimeo thumbnail failed for', id, err);
  }
});

// ─── Video lightbox modal ───
const modal = document.getElementById('video-modal');
const modalPlayer = document.getElementById('modal-player');

function openVideo(provider, id) {
  let src = '';
  if (provider === 'youtube') {
    src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  } else if (provider === 'vimeo') {
    src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
  }
  modalPlayer.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeVideo() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalPlayer.innerHTML = '';
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.work-item').forEach((item) => {
  item.addEventListener('click', () => {
    const provider = item.dataset.provider;
    const id = item.dataset.videoId;
    if (provider && id) openVideo(provider, id);
  });
});

modal.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeVideo);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeVideo();
});

// ─── Contact form ───
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
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data,
    });

    if (res.ok) {
      status.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    } else {
      status.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    status.textContent = 'Failed to send. Please try again.';
  }
});
