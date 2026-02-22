export function fetchPlayerState(playerId) {
    // TODO: Replace with real data source (DB/service)
    return Promise.resolve({
        id: playerId,
        profile: {
            level: 10,
            segment: 'VIP',
            lastPurchase: new Date(),
            inventory: ['item1', 'item2'],
        },
        purchaseHistory: [
            { itemId: 'item1', date: new Date(), price: 9.99 },
        ],
    });
}
