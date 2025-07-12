// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const { protect, authorizeRoles } = require('../middleware/auth'); // Import middleware

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        // req.user is populated by the 'protect' middleware
        // It already excludes the password hash due to .select('-password')
        const userProfile = req.user;

        if (userProfile) {
            res.json(userProfile);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update user profile
// @route   PATCH /api/users/:id
// @access  Private (Owner only)
router.patch('/:id', protect, async (req, res) => {
    const userId = req.params.id;
    const { username, email, location, profilePhoto } = req.body;

    // Users can only update their own profile unless they are an admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this user profile' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (location) user.location = location;
        if (profilePhoto) user.profilePhoto = profilePhoto;
        // Do NOT allow password updates directly here. Use a separate /change-password endpoint.

        const updatedUser = await user.save();

        // Exclude password hash from response
        const { password, ...userProfile } = updatedUser._doc;

        res.json(userProfile);
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete user account (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne(); // Mongoose 6+ uses deleteOne() or deleteMany()
        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;