// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Node.js File System module

const { protect } = require('../middleware/auth');

// Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer storage configuration for local file system
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Files will be stored in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Generate a unique filename: timestamp + original extension
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
    },
});

// @desc    Upload item image
// @route   POST /api/upload
// @access  Private (Authenticated users)
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided or file type not allowed.' });
        }

        // For local storage, the URL will be relative to your server or a static serve route
        // Example: http://localhost:5000/uploads/your-image.jpg
        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });

    } catch (error) {
        console.error('Image upload endpoint error:', error);
        res.status(500).json({ message: 'Server error during image upload' });
    }
});

module.exports = router;