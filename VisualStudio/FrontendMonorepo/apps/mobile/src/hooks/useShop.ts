import { useQuery } from 'react-query';
import { fetchShop } from '@api/src/shopApi';
import { normalizeShopItems } from './normalizeShopItems';

export function useFeaturedShop() {
  return useQuery(['shop', 'featured'], async () => {
    const data = await fetchShop();
    return normalizeShopItems(data.featured);
  }, { staleTime: 5 * 60 * 1000 });
}

export function useSeasonalShop() {
  return useQuery(['shop', 'seasonal'], async () => {
    const data = await fetchShop();
    return normalizeShopItems(data.seasonal);
  }, { staleTime: 5 * 60 * 1000 });
}

export function usePurchaseItem() {
  // This is a placeholder for a mutation hook
  // You can implement with useMutation if needed
  // Example:
  // return useMutation(purchaseShopItem);
  return null;
}
