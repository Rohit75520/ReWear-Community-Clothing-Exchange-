// routes/swaps.js
const express = require('express');
const router = express.Router();
const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');
const mongoose = require('mongoose'); // For transactions
const { protect } = require('../middleware/auth'); // Import middleware

// @desc    Request a swap (item ID + optional offered item ID)
// @route   POST /api/swaps/request
// @access  Private
router.post('/request', protect, async (req, res) => {
    const { requestedItemId, offeredItemId } = req.body; // offeredItemId is optional for direct swap

    if (!requestedItemId) {
        return res.status(400).json({ message: 'Requested item ID is required.' });
    }

    // Start a Mongoose session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const requestedItem = await Item.findById(requestedItemId).session(session);

        if (!requestedItem) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Requested item not found.' });
        }
        if (requestedItem.status !== 'available') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Requested item is not available for swap.' });
        }
        if (requestedItem.userId.toString() === req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Cannot request to swap your own item.' });
        }

        let swapType = 'redemption';
        let offeredItem = null;

        if (offeredItemId) {
            swapType = 'swap';
            offeredItem = await Item.findById(offeredItemId).session(session);

            if (!offeredItem) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Offered item not found.' });
            }
            if (offeredItem.status !== 'available') {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Offered item is not available for swap.' });
            }
            if (offeredItem.userId.toString() !== req.user._id.toString()) {
                await session.abortTransaction();
                session.endSession();
                return res.status(403).json({ message: 'You can only offer your own items.' });
            }
            if (offeredItem._id.toString() === requestedItemId.toString()) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Cannot offer the same item you are requesting.' });
            }

            // Mark offered item as pending
            offeredItem.status = 'pending_swap';
            await offeredItem.save({ session });
        }

        // Mark requested item as pending
        requestedItem.status = 'pending_swap';
        await requestedItem.save({ session });

        const swap = new Swap({
            requesterId: req.user._id,
            requestedItemId: requestedItem._id,
            offeredItemId: offeredItem ? offeredItem._id : null,
            ownerId: requestedItem.userId,
            type: swapType,
            status: 'pending',
            pointsUsed: 0, // Points are handled in /redeem
        });

        const newSwap = await swap.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newSwap);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Swap request error:', error);
        res.status(500).json({ message: 'Server error during swap request' });
    }
});

// @desc    Redeem item using points
// @route   POST /api/swaps/redeem
// @access  Private
router.post('/redeem', protect, async (req, res) => {
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required for redemption.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const item = await Item.findById(itemId).session(session);
        const user = await User.findById(req.user._id).session(session);

        if (!item) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Item not found.' });
        }
        if (item.status !== 'available' || !item.approved) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Item is not available for redemption or not approved.' });
        }
        if (item.userId.toString() === user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Cannot redeem your own item.' });
        }
        if (user.points < item.pointsValue) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Not enough points to redeem this item.' });
        }

        // Deduct points from user
        user.points -= item.pointsValue;
        await user.save({ session });

        // Create a redemption record
        const redemption = new Swap({
            requesterId: user._id,
            requestedItemId: item._id,
            ownerId: item.userId,
            type: 'redemption',
            status: 'completed', // Redemption is usually instant
            pointsUsed: item.pointsValue,
        });
        await redemption.save({ session });

        // Update item status and transfer ownership
        item.status = 'redeemed';
        // Optional: you might want to explicitly set item.userId to the new owner
        // For simplicity, we'll track ownership via swap history for now.
        // If you need direct ownership, you'd change item.userId and save it.
        await item.save({ session });


        // Award points to the original owner of the item (if applicable)
        const owner = await User.findById(item.userId).session(session);
        if (owner) {
            // Define how many points an owner gets when their item is redeemed
            const pointsForOwner = item.pointsValue * 0.8; // Example: owner gets 80% of points
            owner.points += pointsForOwner;
            await owner.save({ session });
        }


        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Item redeemed successfully', redemption });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Redeem item error:', error);
        res.status(500).json({ message: 'Server error during item redemption' });
    }
});


// @desc    Get user’s swap and redemption history
// @route   GET /api/swaps
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // Find swaps where user is requester OR owner
        const swaps = await Swap.find({
            $or: [
                { requesterId: userId },
                { ownerId: userId }
            ]
        })
        .populate('requesterId', 'username email profilePhoto')
        .populate('ownerId', 'username email profilePhoto')
        .populate('requestedItemId', 'title imageUrls')
        .populate('offeredItemId', 'title imageUrls')
        .sort({ createdAt: -1 }); // Sort by most recent

        res.json(swaps);
    } catch (error) {
        console.error('Get swap history error:', error);
        res.status(500).json({ message: 'Server error while fetching swap history' });
    }
});

// @desc    Update swap status (e.g., Approved, Completed, Rejected, Cancelled)
// @route   PATCH /api/swaps/:id/status
// @access  Private (Owner of requested item or Admin)
router.patch('/:id/status', protect, async (req, res) => {
    const swapId = req.params.id;
    const { status } = req.body; // e.g., 'approved', 'rejected', 'completed', 'cancelled'

    if (!['approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid swap status.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const swap = await Swap.findById(swapId).session(session);

        if (!swap) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Swap request not found.' });
        }

        // Only the owner of the requested item or an admin can update status
        if (swap.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Not authorized to update this swap status.' });
        }

        // Prevent updating if already completed/cancelled/rejected
        if (['completed', 'rejected', 'cancelled'].includes(swap.status)) {
             await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Swap is already ${swap.status}. Cannot update.` });
        }


        swap.status = status;
        await swap.save({ session });

        // Handle item status and ownership changes based on swap status
        const requestedItem = await Item.findById(swap.requestedItemId).session(session);
        let offeredItem = null;
        if (swap.offeredItemId) {
            offeredItem = await Item.findById(swap.offeredItemId).session(session);
        }

        if (status === 'completed') {
            if (requestedItem) requestedItem.status = 'swapped';
            if (offeredItem) offeredItem.status = 'swapped';

            // Logic to transfer ownership (update userId for items)
            if (requestedItem) requestedItem.userId = swap.requesterId;
            if (offeredItem) offeredItem.userId = swap.ownerId; // original owner of requested item now gets offered item

            // Save updated items
            if (requestedItem) await requestedItem.save({ session });
            if (offeredItem) await offeredItem.save({ session });

            // Notification: Implement notification logic here (e.g., to requester that swap is complete)
        } else if (['rejected', 'cancelled'].includes(status)) {
            // Revert item statuses back to available if swap is rejected/cancelled
            if (requestedItem) requestedItem.status = 'available';
            if (offeredItem) offeredItem.status = 'available';

            if (requestedItem) await requestedItem.save({ session });
            if (offeredItem) await offeredItem.save({ session });
        }
        // For 'approved' status, item status can remain 'pending_swap' or change to 'approved_for_swap'
        // For 'pending', no change is needed here.

        await session.commitTransaction();
        session.endSession();

        res.json({ message: `Swap status updated to ${status}`, swap });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Update swap status error:', error);
        res.status(500).json({ message: 'Server error during swap status update' });
    }
});

module.exports = router;