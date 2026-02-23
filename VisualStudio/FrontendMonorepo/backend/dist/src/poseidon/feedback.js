// Sprint 6: Human-in-the-Loop Feedback and Learning for Poseidon
// Enables feedback capture, retrieval, and agent learning from user input.
export class FeedbackStore {
    constructor() {
        this.feedback = [];
    }
    addFeedback(entry) {
        this.feedback.push(entry);
    }
    getFeedbackForStep(stepDescription) {
        return this.feedback.filter(f => f.stepDescription === stepDescription);
    }
    getAllFeedback() {
        return [...this.feedback];
    }
}
// Example: Agent learning from feedback (simple count-based adjustment)
export function learnFromFeedback(feedbacks) {
    return feedbacks.reduce((acc, f) => {
        if (f.feedbackType === 'approval')
            acc.approvals++;
        if (f.feedbackType === 'rejection')
            acc.rejections++;
        if (f.feedbackType === 'suggestion')
            acc.suggestions++;
        if (f.feedbackType === 'correction')
            acc.corrections++;
        return acc;
    }, { approvals: 0, rejections: 0, suggestions: 0, corrections: 0 });
}
