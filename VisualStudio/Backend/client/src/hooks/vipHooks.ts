import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getVIPStatus,
  getVIPDailyRewards,
  claimVIPDaily,
  getVIPPerks,
  getVIPCosmetics
} from '../api';

export function useVIPStatus() {
  return useQuery(['vipStatus'], getVIPStatus);
}

export function useVIPDailyRewards() {
  return useQuery(['vipDailyRewards'], getVIPDailyRewards);
}

export function useVIPPerks() {
  return useQuery(['vipPerks'], getVIPPerks);
}

export function useVIPCosmetics() {
  return useQuery(['vipCosmetics'], getVIPCosmetics);
}

export function useClaimVIPDaily() {
  const queryClient = useQueryClient();
  return useMutation(claimVIPDaily, {
    onSuccess: () => {
      queryClient.invalidateQueries(['vipStatus']);
      queryClient.invalidateQueries(['vipDailyRewards']);
    }
  });
}
