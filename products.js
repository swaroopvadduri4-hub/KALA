const express = require('express');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const router = express.Router();

const adapter = new JSONFile('db.json');
const db = new Low(adapter, { sellers: [], products: [], orders: [], videos: [] });

async function initDB() {
  await db.read();
  db.data ||= { sellers: [], products: [], orders: [], videos: [] };
  await db.write();
}
initDB();

// Add product
router.post('/add', async (req, res) => {
  await db.read();
  const { sellerId, name, price, description } = req.body;

  const product = {
    id: Date.now().toString(),
    sellerId,
    name,
    price,
    description,
    buyers: 0
  };

  db.data.products.push(product);
  await db.write();
  res.json({ msg: 'Product added', product });
});

// List products
router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.products);
});


module.exports = router;
