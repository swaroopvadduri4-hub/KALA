const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const router = express.Router();

// Lowdb setup
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { sellers: [], products: [], orders: [], videos: [] });

async function initDB() {
  await db.read();
  db.data ||= { sellers: [], products: [], orders: [], videos: [] };
  await db.write();
}
initDB();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.seller = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

// Register
router.post('/register', async (req, res) => {
  await db.read();
  const { name, email, password, bio } = req.body;

  if (db.data.sellers.find(s => s.email === email))
    return res.status(400).json({ msg: 'Email already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newSeller = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    bio: bio || '',
    avatarUrl: ''
  };

  db.data.sellers.push(newSeller);
  await db.write();
  res.json({ msg: 'Seller registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  await db.read();
  const { email, password } = req.body;

  const seller = db.data.sellers.find(s => s.email === email);
  if (!seller) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, seller.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: seller.id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    token,
    seller: { id: seller.id, name: seller.name, email: seller.email, bio: seller.bio, avatarUrl: seller.avatarUrl }
  });
});

// Profile
router.get('/profile', authMiddleware, async (req, res) => {
  await db.read();
  const seller = db.data.sellers.find(s => s.id === req.seller.id);
  if (!seller) return res.status(404).json({ msg: 'Seller not found' });
  res.json(seller);
});

module.exports = router;
