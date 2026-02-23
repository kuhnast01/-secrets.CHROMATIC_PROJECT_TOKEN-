import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchVipData, claimVipDailyReward, VipData } from 'api';

export function useVip(userId: string) {
  // Query VIP data
  const { data, error, isLoading } = useQuery<VipData>({
    queryKey: ['vip', userId],
    queryFn: fetchVipData,
  });

  // Mutation for claiming daily reward
  const mutation = useMutation<{ success: boolean; reward: string; message?: string }, Error>({
    mutationFn: claimVipDailyReward,
  });

  // Await or handle promise for mutation
  const grantAward = async () => {
    try {
      await mutation.mutateAsync();
    } catch (err) {
      // handle error
      if (typeof console !== 'undefined') {
        console.error(err);
      }
    }
  };

  return { data, error, isLoading, grantAward };
}
