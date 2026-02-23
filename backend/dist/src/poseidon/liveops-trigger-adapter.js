export function listenForLiveOpsEvents(callback) {
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
