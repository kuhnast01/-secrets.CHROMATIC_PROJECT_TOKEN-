import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';

type Event = {
  name: string;
  featuredCommander?: { name: string; imageUrl?: string };
  description?: string;
  milestones?: { id: number; desc: string; reward: string }[];
  progress?: number;
};

type LegendaryHuntScreenRouteParams = {
  event: Event;
};

type Props = StackScreenProps<any, any> & {
  route: { params: LegendaryHuntScreenRouteParams };
};

export default function LegendaryHuntScreen({ route, navigation }: Props) {
  const { event } = route.params;
  // Placeholder/mock data for milestones, progress
  const featuredCommander = event.featuredCommander || { name: 'Legendary Commander', imageUrl: '' };
  const milestones = event.milestones || [
    { id: 1, desc: 'Win 1 Hunt', reward: 'Epic Shard' },
    { id: 2, desc: 'Win 5 Hunts', reward: 'Legendary Shard' },
    { id: 3, desc: 'Win 10 Hunts', reward: 'Legendary Commander' },
  ];
  const progress = event.progress || 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{event.name}</Text>
      {featuredCommander.imageUrl && <Image source={{ uri: featuredCommander.imageUrl }} style={styles.commanderArt} />}
      <Text style={styles.desc}>{event.description}</Text>
      <Text style={styles.progress}>Progress: {progress} / {milestones.length}</Text>
      <Text style={styles.rewardHeading}>Milestone Rewards</Text>
      <FlatList
        data={milestones}
        keyExtractor={item => String(item.id)}
        renderItem={({ item, index }) => (
          <View style={styles.milestoneRow}>
            <Text style={[styles.milestoneDesc, progress > index && styles.milestoneComplete]}>{item.desc}</Text>
            <Text style={styles.milestoneReward}>{item.reward}</Text>
          </View>
        )}
        style={{ marginBottom: 16 }}
      />
      <TouchableOpacity style={styles.cta} onPress={() => { navigation.navigate('HuntMissionPlaceholder', { event }); }}>
        <Text style={styles.ctaText}>Start Hunt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  commanderArt: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12, backgroundColor: '#eee' },
  desc: { fontSize: 15, color: '#555', marginBottom: 8 },
  progress: { fontSize: 16, color: '#3182ce', marginBottom: 8 },
  rewardHeading: { fontSize: 17, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  milestoneRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  milestoneDesc: { color: '#805ad5', fontWeight: 'bold' },
  milestoneComplete: { textDecorationLine: 'line-through', color: '#888' },
  milestoneReward: { color: '#222' },
  cta: { backgroundColor: '#805ad5', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
