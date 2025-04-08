const mongoose = require('mongoose');

const capsuleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    fileMetadata: {
        type: {
            filename: String,
            size: Number,
            mimetype: String
        },
        default: null
    },
    priority: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    targetDeliveryDate: {
        type: Date,
        required: true
    },
    actualDeliveryDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['scheduled', 'delivered', 'expired'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying of capsules by user and delivery date
capsuleSchema.index({ userId: 1, targetDeliveryDate: 1 });

// Method to check if capsule is expired (beyond 1 year from target date)
capsuleSchema.methods.isExpired = function() {
    const oneYearFromTarget = new Date(this.targetDeliveryDate);
    oneYearFromTarget.setFullYear(oneYearFromTarget.getFullYear() + 1);
    return new Date() > oneYearFromTarget;
};

const Capsule = mongoose.model('Capsule', capsuleSchema);

module.exports = Capsule; 