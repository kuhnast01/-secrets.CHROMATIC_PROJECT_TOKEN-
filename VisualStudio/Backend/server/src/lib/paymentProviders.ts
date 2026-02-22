// Pluggable payment provider interface (MVP)
// - DefaultProvider: uses existing `validateReceipt` stub
// - Real providers (App Store / Play) can be added by implementing the same interface

import { validateReceipt } from './payments';

export type VerificationResult = { valid: boolean; provider?: string; details?: any };

export const DefaultProvider = {
  name: 'default-stub',
  async verifyReceipt(receipt: string): Promise<VerificationResult> {
    const ok = validateReceipt(receipt);
    return { valid: !!ok, provider: 'stub', details: { receipt } };
  }
};

// Example placeholder for real provider implementers:
// export const AppStoreProvider = { async verifyReceipt(receipt){ /* call Apple servers */ } }

export let activeProvider = DefaultProvider;

export function useProvider(p: typeof DefaultProvider) {
  activeProvider = p;
}
