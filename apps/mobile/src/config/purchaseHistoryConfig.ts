// purchaseHistoryConfig.ts
// Config for purchase history screen UI and text

export interface PurchaseHistoryScreenConfig {
  title: string;
  emptyText: string;
  errorText: string;
  rowImagePlaceholder?: string;
  dateFormat?: string;
}

export const PURCHASE_HISTORY_CONFIG: PurchaseHistoryScreenConfig = {
  title: 'Purchase History',
  emptyText: 'No purchases yet.',
  errorText: 'Failed to load purchase history.',
  rowImagePlaceholder: 'https://cdn.example.com/placeholders/item.png',
  dateFormat: 'MMM d, yyyy, h:mm a',
};
