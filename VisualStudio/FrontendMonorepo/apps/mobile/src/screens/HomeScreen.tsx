
import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { VipDailyRewardRow } from '@ui/VipDailyRewardRow';
import { useVipDailyReward, useClaimVipDailyReward } from '../hooks/useVipDailyReward';
import { VipRewardPopup } from '@ui/VipRewardPopup';
import { usePlayer } from '../state/PlayerContext';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
// i18n resource keys required in your translation files:
// {
//   "home": {
//     "activeEvents": "Active Events",
//     "loadingEvents": "Loading events...",
//     "failedEvents": "Failed to load events.",
//     "emptyEvents": "No active events.",
//     "viewAllEvents": "View All Events"
//   }
// }

export function HomeScreen() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useVipDailyReward();
  const claimMutation = useClaimVipDailyReward();
  const { player, setPlayer } = usePlayer();
  const [showPopup, setShowPopup] = React.useState(false);
  const [rewardText, setRewardText] = React.useState('');
  const handleClaim = () => {
    claimMutation.mutate(undefined, {
      onSuccess: (result) => {
        setRewardText(result.reward);
        setShowPopup(true);
        // Simulate currency update (replace with real logic as needed)
        if (player) {
          setPlayer({ ...player, currencies: { ...player.currencies, gems: (player.currencies?.gems || 0) + 100 } });
        }
      },
    });
  };
  const handleViewLadder = () => {/* navigation logic here */};
  // Timer logic
  const [timer, setTimer] = React.useState('');
  React.useEffect(() => {
    if (!data?.nextReset) return;
    const update = () => {
      const now = new Date();
      const reset = new Date(data.nextReset);
      const diff = Math.max(0, reset.getTime() - now.getTime());
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimer(`${h}:${m}:${s}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => { clearInterval(interval); };
  }, [data?.nextReset]);
  // Events integration
  const { data: events, isLoading: eventsLoading, error: eventsError } = useEvents();
  const navigation = { navigate: () => {} }; // Replace with real navigation if available

  return (
    <View style={styles.container}>
      {/* VIP Daily Reward */}
      {isLoading ? (
        <View>
          <VipDailyRewardRow reward="" claimed={false} claimable={false} onClaim={() => {}} timer={timer} onViewLadder={handleViewLadder} />
        </View>
      ) : error ? (
        <View>
          <VipDailyRewardRow reward="" claimed={false} claimable={false} onClaim={() => refetch()} timer={timer} onViewLadder={handleViewLadder} />
        </View>
      ) : data ? (
        <>
          <VipDailyRewardRow
            reward={data.reward}
            claimed={data.claimed}
            claimable={data.claimable}
            onClaim={handleClaim}
            timer={timer}
            onViewLadder={handleViewLadder}
          />
          <VipRewardPopup reward={rewardText} visible={showPopup} onClose={() => { setShowPopup(false); }} />
        </>
      ) : null}

      {/* Events Section */}
      <View style={{ width: '100%', marginTop: 24 }}>
        <Text style={styles.eventsHeading} accessibilityRole="header" accessibilityLabel={t('home.activeEvents')} testID="home-active-events-heading">
          {t('home.activeEvents')}
        </Text>
        {eventsLoading && (
          <Text style={styles.eventsLoading} accessibilityLabel={t('home.loadingEvents')} testID="home-events-loading">
            {t('home.loadingEvents')}
          </Text>
        )}
        {eventsError && (
          <Text style={styles.eventsError} accessibilityLabel={t('home.failedEvents')} testID="home-events-error">
            {t('home.failedEvents')}
          </Text>
        )}
        {!eventsLoading && !eventsError && events && events.length === 0 && (
          <Text style={styles.eventsEmpty} accessibilityLabel={t('home.emptyEvents')} testID="home-events-empty">
            {t('home.emptyEvents')}
          </Text>
        )}
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} onEnter={() => { navigation.navigate(item.entryScreen, { event: item }); }} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
        />
        <TouchableOpacity
          style={styles.eventsCta}
          onPress={() => { navigation.navigate('EventsHubScreen'); }}
          accessibilityRole="button"
          accessibilityLabel={t('home.viewAllEvents')}
          testID="home-events-view-all-btn"
        >
          <Text style={styles.eventsCtaText}>{t('home.viewAllEvents')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff', paddingTop: 24 },
  eventsHeading: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, marginLeft: 8 },
  eventsLoading: { color: '#888', marginLeft: 8 },
  eventsError: { color: 'red', marginLeft: 8 },
  eventsEmpty: { color: '#aaa', marginLeft: 8 },
  eventsList: { paddingLeft: 8, paddingBottom: 8 },
  eventsCta: { marginTop: 8, alignSelf: 'flex-end', marginRight: 16, backgroundColor: '#3182ce', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  eventsCtaText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
