// Sprint 6: Human-in-the-Loop Feedback and Learning for Poseidon
// Enables feedback capture, retrieval, and agent learning from user input.

export type FeedbackType = 'approval' | 'rejection' | 'suggestion' | 'correction';

export interface AgentFeedback {
  stepDescription: string;
  feedbackType: FeedbackType;
  message: string;
  user: string;
  timestamp: number;
}

export class FeedbackStore {
  private feedback: AgentFeedback[] = [];

  addFeedback(entry: AgentFeedback) {
    this.feedback.push(entry);
  }

  getFeedbackForStep(stepDescription: string): AgentFeedback[] {
    return this.feedback.filter(f => f.stepDescription === stepDescription);
  }

  getAllFeedback(): AgentFeedback[] {
    return [...this.feedback];
  }
}

// Example: Agent learning from feedback (simple count-based adjustment)
export function learnFromFeedback(feedbacks: AgentFeedback[]): { approvals: number; rejections: number; suggestions: number; corrections: number } {
  return feedbacks.reduce((acc, f) => {
    if (f.feedbackType === 'approval') acc.approvals++;
    if (f.feedbackType === 'rejection') acc.rejections++;
    if (f.feedbackType === 'suggestion') acc.suggestions++;
    if (f.feedbackType === 'correction') acc.corrections++;
    return acc;
  }, { approvals: 0, rejections: 0, suggestions: 0, corrections: 0 });
}
