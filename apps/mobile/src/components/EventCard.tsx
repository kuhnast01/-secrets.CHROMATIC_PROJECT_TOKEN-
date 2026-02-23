
import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import TimerBadge from './TimerBadge';

// i18n resource keys required in your translation files:
// {
//   "eventCard": {
//     "cta": "Enter Event",
//     "type": {
//       "Boss": "Boss",
//       "Hunt": "Hunt",
//       "Raid": "Raid"
//     }
//   }
// }

export function EventCardSkeleton() {
  return (
    <View style={[styles.card, { opacity: 0.5 }]}> 
      <View style={[styles.keyArt, { backgroundColor: '#eee' }]} />
      <View style={styles.info}>
        <View style={[styles.skelLine, { width: 80, height: 18 }]} />
        <View style={[styles.skelLine, { width: 120, height: 12, marginBottom: 8 }]} />
        <View style={[styles.skelLine, { width: 60, height: 12, marginBottom: 8 }]} />
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {[1,2,3].map(i => <View key={i} style={[styles.rewardIcon, { backgroundColor: '#ddd' }]} />)}
        </View>
        <View style={[styles.skelLine, { width: 100, height: 16 }]} />
      </View>
    </View>
  );
}

type Event = {
  name: string;
  keyArtUrl?: string;
  description?: string;
  type: string;
  endTime?: string;
  rewards?: { iconUrl: string }[];
};

interface EventCardProps {
  event: Event;
  onEnter: () => void;
}


export default function EventCard({ event, onEnter }: EventCardProps) {
  const { t } = useTranslation();
  const anim = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
  }, []);
  // Only include style objects that are valid for Animated.View
  const typeStyle = styles[`type_${event.type}` as keyof typeof styles];
  return (
    <Animated.View style={[styles.card, typeof typeStyle === 'object' ? typeStyle : null, { transform: [{ scale: anim }] }]}> 
      {event.keyArtUrl && (
        <Image source={{ uri: event.keyArtUrl }} style={styles.keyArt} />
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.desc}>{event.description}</Text>
        <View style={styles.row}>
          <TimerBadge expiresAt={event.endTime || ''} />
          <Text style={[styles.type, { color: '#3182ce', fontWeight: 'bold', fontSize: 13 }]}>{t(`eventCard.type.${event.type}`, event.type)}</Text>
        </View>
        <View style={styles.rewardsRow}>
          {event.rewards && event.rewards.map((r: { iconUrl: string }, i: number) => (
            <Image key={i} source={{ uri: r.iconUrl }} style={styles.rewardIcon} />
          ))}
        </View>
        <TouchableOpacity style={styles.cta} onPress={onEnter}>
          <Text style={[styles.ctaText, { color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>{t('eventCard.cta', 'Enter Event')}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  keyArt: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#eee',
  },
  info: { flex: 1, padding: 12 },
  skelLine: { backgroundColor: '#ddd', borderRadius: 6, marginBottom: 6 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  desc: { fontSize: 14, color: '#555', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  type: { marginLeft: 8 },
  rewardsRow: { flexDirection: 'row', marginBottom: 8 },
  rewardIcon: { width: 28, height: 28, marginRight: 6, borderRadius: 6, backgroundColor: '#eee' },
  cta: { backgroundColor: '#3182ce', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  ctaText: {},
  type_Boss: { borderLeftWidth: 6, borderLeftColor: '#e67e22' },
  type_Hunt: { borderLeftWidth: 6, borderLeftColor: '#805ad5' },
  type_Raid: { borderLeftWidth: 6, borderLeftColor: '#3182ce' },
});
