export interface VIPAward {
  userId: string;
  awardType: string;
  awardedAt: Date;
}

export function grantVIPAward(userId: string, awardType: string): VIPAward {
  return {
    userId,
    awardType,
    awardedAt: new Date(),
  };
}

// Example usage:
// const award = grantVIPAward('user123', 'gold');
