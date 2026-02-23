// Sprint 6: Human-in-the-Loop Feedback and Learning tests
import { FeedbackStore, AgentFeedback, learnFromFeedback } from './feedback';

describe('FeedbackStore', () => {
  let store: FeedbackStore;
  const now = Date.now();

  beforeEach(() => {
    store = new FeedbackStore();
  });

  it('should add and retrieve feedback for a step', () => {
    const feedback: AgentFeedback = {
      stepDescription: 'Write file',
      feedbackType: 'approval',
      message: 'Looks good',
      user: 'alice',
      timestamp: now,
    };
    store.addFeedback(feedback);
    const retrieved = store.getFeedbackForStep('Write file');
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].user).toBe('alice');
  });

  it('should retrieve all feedback', () => {
    store.addFeedback({ stepDescription: 'A', feedbackType: 'approval', message: '', user: 'bob', timestamp: now });
    store.addFeedback({ stepDescription: 'B', feedbackType: 'rejection', message: '', user: 'carol', timestamp: now });
    expect(store.getAllFeedback().length).toBe(2);
  });
});

describe('learnFromFeedback', () => {
  it('should count feedback types', () => {
    const now = Date.now();
    const feedbacks: AgentFeedback[] = [
      { stepDescription: 'X', feedbackType: 'approval', message: '', user: 'a', timestamp: now },
      { stepDescription: 'X', feedbackType: 'rejection', message: '', user: 'b', timestamp: now },
      { stepDescription: 'X', feedbackType: 'suggestion', message: '', user: 'c', timestamp: now },
      { stepDescription: 'X', feedbackType: 'correction', message: '', user: 'd', timestamp: now },
      { stepDescription: 'X', feedbackType: 'approval', message: '', user: 'e', timestamp: now },
    ];
    const result = learnFromFeedback(feedbacks);
    expect(result.approvals).toBe(2);
    expect(result.rejections).toBe(1);
    expect(result.suggestions).toBe(1);
    expect(result.corrections).toBe(1);
  });
});
