const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Contact form API
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  console.log('--- New Contact Message ---');
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Message: ${message}`);
  console.log('---------------------------');

  res.json({ success: true, message: 'Thanks! Your message has been received.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
