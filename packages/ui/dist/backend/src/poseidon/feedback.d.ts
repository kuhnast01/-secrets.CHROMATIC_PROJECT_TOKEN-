export type FeedbackType = 'approval' | 'rejection' | 'suggestion' | 'correction';
export interface AgentFeedback {
    stepDescription: string;
    feedbackType: FeedbackType;
    message: string;
    user: string;
    timestamp: number;
}
export declare class FeedbackStore {
    private feedback;
    addFeedback(entry: AgentFeedback): void;
    getFeedbackForStep(stepDescription: string): AgentFeedback[];
    getAllFeedback(): AgentFeedback[];
}
export declare function learnFromFeedback(feedbacks: AgentFeedback[]): {
    approvals: number;
    rejections: number;
    suggestions: number;
    corrections: number;
};
