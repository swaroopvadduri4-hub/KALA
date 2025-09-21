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

// Place order
router.post('/add', async (req, res) => {
  await db.read();
  const { productId, buyerName } = req.body;

  const product = db.data.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ msg: 'Product not found' });

  const order = {
    id: Date.now().toString(),
    productId,
    buyerName,
    date: new Date()
  };

  db.data.orders.push(order);
  product.buyers += 1; // increment buyer count
  await db.write();

  res.json({ msg: 'Order placed', order });
});

// List orders
router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.orders);
});

module.exports = router;
