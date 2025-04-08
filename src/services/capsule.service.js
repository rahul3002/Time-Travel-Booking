const Capsule = require('../models/capsule.model');

class CapsuleService {
    async createCapsule(capsuleData) {
        // Validate delivery date is not beyond 1 year
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        if (capsuleData.targetDeliveryDate > oneYearFromNow) {
            throw new Error('Delivery date cannot be beyond 1 year from now');
        }

        // Check for existing capsules on the same day
        const existingCapsule = await this.findConflictingCapsule(
            capsuleData.userId,
            capsuleData.targetDeliveryDate
        );

        if (existingCapsule) {
            // Reschedule the new capsule if there's a conflict
            capsuleData.targetDeliveryDate = await this.findNextAvailableDate(
                capsuleData.userId,
                capsuleData.targetDeliveryDate
            );
        }

        const capsule = new Capsule(capsuleData);
        return await capsule.save();
    }

    async findConflictingCapsule(userId, targetDate) {
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        return await Capsule.findOne({
            userId,
            targetDeliveryDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: 'scheduled'
        }).sort({ priority: -1, createdAt: 1 });
    }

    async findNextAvailableDate(userId, startDate) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);

        while (true) {
            const conflictingCapsule = await this.findConflictingCapsule(userId, currentDate);
            if (!conflictingCapsule) {
                return currentDate;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    async getCapsulesByUser(userId) {
        return await Capsule.find({ userId }).sort({ targetDeliveryDate: 1 });
    }

    async getCapsuleById(capsuleId) {
        return await Capsule.findById(capsuleId);
    }

    async processScheduledCapsules() {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Find all capsules scheduled for today
        const scheduledCapsules = await Capsule.find({
            targetDeliveryDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: 'scheduled'
        }).sort({ priority: -1, createdAt: 1 });

        // Group capsules by user
        const userCapsules = {};
        scheduledCapsules.forEach(capsule => {
            if (!userCapsules[capsule.userId]) {
                userCapsules[capsule.userId] = [];
            }
            userCapsules[capsule.userId].push(capsule);
        });

        // Process capsules for each user
        for (const [userId, capsules] of Object.entries(userCapsules)) {
            // Deliver the highest priority capsule
            const highestPriorityCapsule = capsules[0];
            highestPriorityCapsule.status = 'delivered';
            highestPriorityCapsule.actualDeliveryDate = now;
            await highestPriorityCapsule.save();

            // Reschedule remaining capsules
            for (let i = 1; i < capsules.length; i++) {
                const capsule = capsules[i];
                capsule.targetDeliveryDate = await this.findNextAvailableDate(
                    userId,
                    capsule.targetDeliveryDate
                );
                await capsule.save();
            }
        }

        // Mark expired capsules
        const expiredCapsules = await Capsule.find({
            status: 'scheduled',
            targetDeliveryDate: { $lt: startOfDay }
        });

        for (const capsule of expiredCapsules) {
            if (capsule.isExpired()) {
                capsule.status = 'expired';
                await capsule.save();
            }
        }
    }
}

module.exports = new CapsuleService(); 