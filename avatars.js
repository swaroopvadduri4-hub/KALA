const express = require("express");
const multer = require("multer");
const path = require("path");
const { Low, JSONFile } = require("lowdb/node");
const fs = require("fs");
const avatarsRoutes = require("./routes/avatars");
app.use("/avatars", avatarsRoutes);


// Ensure folder exists
if (!fs.existsSync("uploads/avatars")) fs.mkdirSync("uploads/avatars", { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// LowDB setup
const adapter = new JSONFile("db.json");
const db = new Low(adapter);
async function initDB() {
  await db.read();
  db.data ||= { avatars: [] };
  await db.write();
}
initDB();

// POST avatar
router.post("/", upload.single("avatar"), async (req, res) => {
  await db.read();
  const newAvatar = {
    id: Date.now().toString(),
    sellerName: req.body.sellerName,
    avatar: "uploads/avatars/" + req.file.filename
  };
  db.data.avatars.push(newAvatar);
  await db.write();
  res.json({ success: true, avatar: newAvatar });
});

// GET all avatars
router.get("/", async (req, res) => {
  await db.read();
  res.json(db.data.avatars);
});

module.exports = router;
