// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Import Item model
const { protect, authorizeRoles } = require('../middleware/auth'); // Import middleware

// @desc    Add new item listing
// @route   POST /api/items
// @access  Private (Authenticated users)
router.post('/', protect, async (req, res) => {
    const { title, description, category, type, size, condition, tags, imageUrls, pointsValue } = req.body;

    // Basic validation
    if (!title || !description || !category || !type || !size || !condition || !imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ message: 'Please include all required item fields and at least one image.' });
    }

    try {
        const item = new Item({
            userId: req.user._id, // User ID from authenticated request
            title,
            description,
            category,
            type,
            size,
            condition,
            tags: tags || [],
            imageUrls,
            pointsValue: pointsValue || 0, // Allow setting points value if provided, default to 0
            // status and approved fields default in model
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);

    } catch (error) {
        console.error('Add item error:', error);
        res.status(500).json({ message: 'Server error while adding item' });
    }
});

// @desc    Get all items
// @route   GET /api/items
// @access  Public (optional filters: category, size, status)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.size) {
            filter.size = req.query.size;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // By default, only show approved items to public
        if (!req.query.approved || req.query.approved === 'true') {
            filter.approved = true;
        }
        // If an admin specifically requests unapproved items, allow it
        if (req.query.approved === 'false' && req.user && req.user.role === 'admin') {
            filter.approved = false;
        }


        const items = await Item.find(filter).populate('userId', 'username email profilePhoto'); // Populate user info

        res.json(items);
    } catch (error) {
        console.error('Get all items error:', error);
        res.status(500).json({ message: 'Server error while fetching items' });
    }
});

// @desc    Get details of a specific item
// @route   GET /api/items/:id
// @access  Public
router.get('/:id', protect, async (req, res) => { // Added protect middleware here for req.user check
    try {
        const item = await Item.findById(req.params.id).populate('userId', 'username email profilePhoto');

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Only return if approved or if the request is from the owner/admin
        if (item.approved || (req.user && (item.userId._id.toString() === req.user._id.toString() || req.user.role === 'admin'))) {
            res.json(item);
        } else {
            res.status(403).json({ message: 'Item not approved or not authorized to view' });
        }

    } catch (error) {
        console.error('Get item by ID error:', error);
        res.status(500).json({ message: 'Server error while fetching item' });
    }
});

// @desc    Update item (owner only)
// @route   PATCH /api/items/:id
// @access  Private (Owner only)
router.patch('/:id', protect, async (req, res) => {
    const itemId = req.params.id;
    const { title, description, category, type, size, condition, tags, imageUrls, status, pointsValue } = req.body;

    try {
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the authenticated user is the owner of the item
        if (item.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        if (title) item.title = title;
        if (description) item.description = description;
        if (category) item.category = category;
        if (type) item.type = type;
        if (size) item.size = size;
        if (condition) item.condition = condition;
        if (tags) item.tags = tags;
        if (imageUrls) item.imageUrls = imageUrls;
        if (status) item.status = status;
        if (pointsValue !== undefined) item.pointsValue = pointsValue;

        const updatedItem = await item.save(); // pre-save hook updates `updatedAt`
        res.json(updatedItem);

    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ message: 'Server error while updating item' });
    }
});

// @desc    Delete item (owner or admin)
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res) => {
    const itemId = req.params.id;

    try {
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the authenticated user is the owner OR an admin
        if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        await item.deleteOne();
        res.json({ message: 'Item deleted successfully' });

    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ message: 'Server error while deleting item' });
    }
});

module.exports = router;