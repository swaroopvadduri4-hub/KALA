const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos'); // save files in uploads/videos folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Example: Upload image + prompt to "generate" video
router.post('/create', upload.single('image'), (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    return res.status(400).json({ error: 'Image and prompt are required' });
  }

  // Normally, here you’d call an AI API (e.g. OpenAI, Gemini, etc.)
  // For now, we just simulate a response
  res.json({
    msg: 'Video generation task created successfully',
    prompt,
    imageUrl: `/uploads/videos/${file.filename}`,
    videoUrl: '/sample/generated_video.mp4' // placeholder video
  });
});

// Example: Get all videos (mock only)
router.get('/', (req, res) => {
  res.json({
    msg: 'Videos route is working',
    videos: []
  });
});

module.exports = router;
