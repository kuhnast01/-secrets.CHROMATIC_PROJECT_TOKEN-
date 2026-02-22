// Minimal payment/receipt validator (MVP stub)

export function validateReceipt(receipt: string) {
  // Development-friendly stub:
  // - receipts starting with "valid-" are accepted
  // - receipts starting with "test-" are accepted in dev
  // - otherwise reject
  if (!receipt || typeof receipt !== 'string') return false;
  if (receipt.startsWith('valid-') || receipt.startsWith('test-')) return true;
  return false;
}
