const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express(); // ✅ app defined FIRST
const PORT = 3000;
const JWT_SECRET = 'super-secret-jwt-key';

app.use(express.json());

// In-memory storage
let users = [];
let contacts = [];

// =======================
// AUTH MIDDLEWARE
// =======================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// =======================
// AUTH ROUTES
// =======================

// Register
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: 'User registered' });
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// =======================
// CONTACT ROUTES (protected)
// =======================

// Create contact
app.post('/contacts', authMiddleware, (req, res) => {
  const { name, phone, email } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const contact = {
    id: contacts.length + 1,
    userId: req.user.userId,
    name,
    phone,
    email
  };

  contacts.push(contact);
  res.status(201).json(contact);
});

// Get contacts
app.get('/contacts', authMiddleware, (req, res) => {
  res.json(contacts.filter(c => c.userId === req.user.userId));
});

// Update contact
app.put('/contacts/:id', authMiddleware, (req, res) => {
  const contact = contacts.find(
    c => c.id === Number(req.params.id) && c.userId === req.user.userId
  );

  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  Object.assign(contact, req.body);
  res.json(contact);
});

// Delete contact
app.delete('/contacts/:id', authMiddleware, (req, res) => {
  const index = contacts.findIndex(
    c => c.id === Number(req.params.id) && c.userId === req.user.userId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  contacts.splice(index, 1);
  res.json({ message: 'Contact deleted' });
});

// =======================
// HEALTH
// =======================
app.get('/', (req, res) => {
  res.send('Contacts API running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
