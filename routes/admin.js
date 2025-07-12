// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Swap = require('../models/Swap');
const { protect, authorizeRoles } = require('../middleware/auth'); // Import middleware

// All routes in this file will be protected and require 'admin' role
router.use(protect, authorizeRoles('admin'));

// @desc    List all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error('Admin: List users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Change user role (e.g., make admin)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
router.patch('/users/:id/role', async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided. Must be "user" or "admin".' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent changing own role for self-lockout or to prevent demoting last admin
        if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
            return res.status(400).json({ message: 'Cannot demote your own admin role.' });
        }

        user.role = role;
        await user.save();

        const { password, ...updatedUser } = user._doc;
        res.json({ message: `User role updated to ${role}`, user: updatedUser });
    } catch (error) {
        console.error('Admin: Change user role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Admin cannot delete their own account.' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Admin: Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    View all item listings (including unapproved)
// @route   GET /api/admin/items
// @access  Private/Admin
router.get('/items', async (req, res) => {
    try {
        // Admins can see all items, regardless of approval status or filters
        const items = await Item.find({}).populate('userId', 'username email');
        res.json(items);
    } catch (error) {
        console.error('Admin: View items error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Approve or reject item
// @route   PATCH /api/admin/items/:id/approve
// @access  Private/Admin
router.patch('/items/:id/approve', async (req, res) => {
    const itemId = req.params.id;
    const { approved } = req.body; // boolean: true or false

    if (typeof approved !== 'boolean') {
        return res.status(400).json({ message: 'Boolean value for "approved" is required.' });
    }

    try {
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        item.approved = approved;
        await item.save();

        res.json({ message: `Item approval status set to ${approved}`, item });
    } catch (error) {
        console.error('Admin: Approve item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Remove spam/inappropriate item
// @route   DELETE /api/admin/items/:id (Already handled in routes/items.js, but with admin check)
//          You could have a dedicated admin delete if preferred, but existing route handles it.

module.exports = router;