// models/Swap.js
const mongoose = require('mongoose');

const SwapSchema = mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    requestedItemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item'
    },
    // For direct swaps, this is the item the requester offers
    // For point redemptions, this would be null
    offeredItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null // Null if it's a point redemption
    },
    // The user who owns the requested item
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['swap', 'redemption'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    pointsUsed: { // Only applicable for redemption type
        type: Number,
        default: 0
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
SwapSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update `updatedAt` on update operations
SwapSchema.pre('findOneAndUpdate', function(next) {
    this._update.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Swap', SwapSchema);