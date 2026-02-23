
import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import EventCard, { EventCardSkeleton } from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';


// Haptic feedback helper
function triggerHaptic() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // @ts-ignore
    if (window?.navigator?.vibrate) window.navigator.vibrate(10);
  }
}

// i18n resource keys required in your translation files:
// {
//   "eventsHub": {
//     "heading": "Events Hub",
//     "failed": "Failed to load events.",
//     "retry": "Retry",
//     "empty": "No active events."
//   }
// }


export default function EventsHubScreen({ navigation }) {
  const { t } = useTranslation();
  const { data: events, isLoading, error, refetch } = useEvents();

  const handleEnter = (event) => {
    triggerHaptic();
    navigation.navigate(event.entryScreen, { event });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading} accessibilityRole="header" accessibilityLabel={t('eventsHub.heading')} testID="events-hub-heading">
        {t('eventsHub.heading')}
      </Text>
      {isLoading && (
        <View style={{ marginTop: 40 }}>
          {[1,2,3].map(i => <EventCardSkeleton key={i} />)}
        </View>
      )}
      {error && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: 'red', fontSize: 16 }} accessibilityLabel={t('eventsHub.failed')} testID="events-hub-failed">
            {t('eventsHub.failed')}
          </Text>
          <TouchableOpacity onPress={refetch} style={styles.retryBtn} accessibilityRole="button" accessibilityLabel={t('eventsHub.retry')} testID="events-hub-retry-btn">
            <Text style={styles.retry}>{t('eventsHub.retry')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isLoading && !error && events && events.length === 0 && (
        <Text style={styles.empty} accessibilityLabel={t('eventsHub.empty')} testID="events-hub-empty">
          {t('eventsHub.empty')}
        </Text>
      )}
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventCard event={item} onEnter={() => { handleEnter(item); }} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  list: { paddingBottom: 24 },
  empty: { color: '#aaa', fontSize: 18, textAlign: 'center', marginTop: 40 },
  retryBtn: { marginTop: 12, backgroundColor: '#3182ce', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  retry: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
