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

// List all sellers
router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.sellers);
});


module.exports = router;
