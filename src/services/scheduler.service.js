const capsuleService = require('./capsule.service');

class SchedulerService {
    constructor() {
        this.isProcessing = false;
    }

    async startScheduler() {
        // Run every day at midnight
        setInterval(async () => {
            if (!this.isProcessing) {
                try {
                    this.isProcessing = true;
                    await this.processDailyCapsules();
                } catch (error) {
                    console.error('Error processing daily capsules:', error);
                } finally {
                    this.isProcessing = false;
                }
            }
        }, this.getTimeUntilNextMidnight());
    }

    getTimeUntilNextMidnight() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        return midnight - now;
    }

    async processDailyCapsules() {
        console.log('Starting daily capsule processing...');
        await capsuleService.processScheduledCapsules();
        console.log('Daily capsule processing completed');
    }
}

module.exports = new SchedulerService(); 