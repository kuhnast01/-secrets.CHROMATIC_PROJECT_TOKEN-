// LiveOps Trigger Adapter
export interface LiveOpsEvent {
  id: string;
  type: string;
  timestamp: Date;
  payload: Record<string, any>;
}

export function listenForLiveOpsEvents(callback: (event: LiveOpsEvent) => void) {
  // TODO: Replace with real event source (pub/sub, websocket, etc.)
  // Example: Simulate event
  setTimeout(() => {
    callback({
      id: 'event1',
      type: 'campaign',
      timestamp: new Date(),
      payload: { campaignId: 'spring-sale' },
    });
  }, 1000);
}
