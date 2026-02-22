import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { StackScreenProps } from '@react-navigation/stack';

type Event = {
  name: string;
  keyArtUrl?: string;
  description?: string;
  bossHP?: number;
  playerHP?: number;
  attempts?: number;
  rewardTiers?: { tier: number; desc: string; reward: string }[];
};

type SeasonalBossScreenRouteParams = {
  event: Event;
};

type Props = StackScreenProps<any, any> & {
  route: { params: SeasonalBossScreenRouteParams };
};


// i18n resource keys required in your translation files:
// {
//   "seasonalBoss": {
//     "bossHP": "Boss HP: {{hp}}",
//     "yourDamage": "Your Damage: {{hp}}",
//     "attempts": "Attempts Remaining: {{count}}",
//     "rewardTiers": "Reward Tiers",
//     "fight": "Fight"
//   }
// }

export default function SeasonalBossScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { event } = route.params;
  // Placeholder/mock data for boss HP, rewards, attempts
  const bossHP = event.bossHP || 1000000;
  const playerHP = event.playerHP || 50000;
  const attempts = event.attempts || 3;
  const rewardTiers = event.rewardTiers || [
    { tier: 1, desc: 'Top 1%', reward: 'Legendary Chest' },
    { tier: 2, desc: 'Top 10%', reward: 'Epic Chest' },
    { tier: 3, desc: 'Participation', reward: 'Rare Chest' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading} accessibilityRole="header" testID="seasonal-boss-heading">{event.name}</Text>
      {event.keyArtUrl && <Image source={{ uri: event.keyArtUrl }} style={styles.bossArt} />}
      <Text style={styles.desc} testID="seasonal-boss-desc">{event.description}</Text>
      <Text style={styles.hp} testID="seasonal-boss-hp">{t('seasonalBoss.bossHP', { hp: bossHP.toLocaleString() })}</Text>
      <Text style={styles.hp} testID="seasonal-boss-player-hp">{t('seasonalBoss.yourDamage', { hp: playerHP.toLocaleString() })}</Text>
      <Text style={styles.attempts} testID="seasonal-boss-attempts">{t('seasonalBoss.attempts', { count: attempts })}</Text>
      <Text style={styles.rewardHeading} testID="seasonal-boss-reward-heading">{t('seasonalBoss.rewardTiers')}</Text>
      <FlatList
        data={rewardTiers}
        keyExtractor={item => String(item.tier)}
        renderItem={({ item }) => (
          <View style={styles.rewardRow}>
            <Text style={styles.rewardTier}>{item.desc}</Text>
            <Text style={styles.rewardName}>{item.reward}</Text>
          </View>
        )}
        style={{ marginBottom: 16 }}
      />
      <TouchableOpacity style={styles.cta} onPress={() => { navigation.navigate('BossBattlePlaceholder', { event }); }} accessibilityRole="button" accessibilityLabel={t('seasonalBoss.fight')} testID="seasonal-boss-fight-btn">
        <Text style={styles.ctaText}>{t('seasonalBoss.fight')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  bossArt: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12, backgroundColor: '#eee' },
  desc: { fontSize: 15, color: '#555', marginBottom: 8 },
  hp: { fontSize: 16, color: '#e67e22', marginBottom: 2 },
  attempts: { fontSize: 15, color: '#3182ce', marginBottom: 8 },
  rewardHeading: { fontSize: 17, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  rewardTier: { color: '#805ad5', fontWeight: 'bold' },
  rewardName: { color: '#222' },
  cta: { backgroundColor: '#e67e22', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
