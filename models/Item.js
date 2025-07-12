// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // References the User model
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true // e.g., 'tops', 'bottoms', 'outerwear', 'accessories'
    },
    type: {
        type: String, // e.g., 'shirt', 'jeans', 'jacket', 'dress'
        required: true
    },
    size: {
        type: String,
        required: true // e.g., 'S', 'M', 'L', 'XL' or numeric
    },
    condition: {
        type: String,
        required: true, // e.g., 'new with tags', 'excellent', 'good', 'fair'
        enum: ['new with tags', 'excellent', 'good', 'fair'] // Enforce specific values
    },
    tags: {
        type: [String], // Array of strings for search keywords
        default: []
    },
    imageUrls: {
        type: [String], // Array of URLs to uploaded images
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'An item must have at least one image.'
        }
    },
    status: {
        type: String,
        enum: ['available', 'pending_swap', 'swapped', 'redeemed'],
        default: 'available'
    },
    approved: {
        type: Boolean,
        default: false // For admin approval
    },
    pointsValue: {
        type: Number,
        default: 0 // Points required to redeem this item
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update `updatedAt` on save
ItemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update `updatedAt` on update operations
ItemSchema.pre('findOneAndUpdate', function(next) {
    this._update.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Item', ItemSchema);