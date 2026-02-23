import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import CosmeticsGrid from '../components/CosmeticsGrid';
// TODO: Replace with real navigation and data fetching

// i18n resource keys required in your translation files:
// {
//   "cosmeticsHub": {
//     "tabs": {
//       "commanders": "Commanders",
//       "ships": "Ships",
//       "profile": "Profile",
//       "guild": "Guild",
//       "seasonal": "Seasonal"
//     },
//     "loading": "Loading cosmetics...",
//     "failed": "Failed to load cosmetics.",
//     "retry": "Retry"
//   }
// }

const TABS = [
  { key: 'commanders', labelKey: 'cosmeticsHub.tabs.commanders' },
  { key: 'ships', labelKey: 'cosmeticsHub.tabs.ships' },
  { key: 'profile', labelKey: 'cosmeticsHub.tabs.profile' },
  { key: 'guild', labelKey: 'cosmeticsHub.tabs.guild' },
  { key: 'seasonal', labelKey: 'cosmeticsHub.tabs.seasonal' },
];



export default function CosmeticsHubScreen({ navigation }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [cosmetics, setCosmetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      // Simulate random error
      if (Math.random() < 0.15) {
        setError(t('cosmeticsHub.failed'));
        setLoading(false);
      } else {
        // Add a seasonal cosmetic for demo
        setCosmetics([
          { id: '1', name: 'Cosmetic 1', previewUrl: '', rarity: 'Rare', type: 'Skin', unlockSource: 'Shop', owned: true },
          { id: '2', name: 'Cosmetic 2', previewUrl: '', rarity: 'Epic', type: 'Frame', unlockSource: 'Pass', owned: false },
          { id: '3', name: 'Cosmetic 3', previewUrl: '', rarity: 'Legendary', type: 'Title', unlockSource: 'Event', owned: true },
          { id: '4', name: 'Seasonal Cosmetic', previewUrl: '', rarity: 'Epic', type: 'Skin', unlockSource: 'Seasonal', owned: false, seasonal: true },
        ]);
        setLoading(false);
      }
    }, 700);
  }, [activeTab, t]);

  const handleSelectCosmetic = (cosmetic) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('CosmeticDetailScreen', { cosmetic });
    }
  };
  const handleRetry = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setCosmetics([
        { id: '1', name: 'Cosmetic 1', previewUrl: '', rarity: 'Rare', type: 'Skin', unlockSource: 'Shop', owned: true },
        { id: '2', name: 'Cosmetic 2', previewUrl: '', rarity: 'Epic', type: 'Frame', unlockSource: 'Pass', owned: false },
        { id: '3', name: 'Cosmetic 3', previewUrl: '', rarity: 'Legendary', type: 'Title', unlockSource: 'Event', owned: true },
      ]);
      setLoading(false);
    }, 700);
  };

  // Filter for seasonal tab
  const filteredCosmetics = activeTab === 'seasonal'
    ? cosmetics.filter(c => c.seasonal)
    : cosmetics.filter(c => !c.seasonal);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <Text
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => { setActiveTab(tab.key); }}
            accessibilityRole="tab"
            accessibilityLabel={t(tab.labelKey)}
            testID={`cosmetics-hub-tab-${tab.key}`}
          >
            {t(tab.labelKey)}
          </Text>
        ))}
      </View>
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.placeholder} accessibilityLabel={t('cosmeticsHub.loading')} testID="cosmetics-hub-loading">
            {t('cosmeticsHub.loading')}
          </Text>
        ) : error ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={[styles.placeholder, { color: 'red' }]} accessibilityLabel={t('cosmeticsHub.failed')} testID="cosmetics-hub-failed">
              {t('cosmeticsHub.failed')}
            </Text>
            <Text
              style={[styles.tab, { color: '#3182ce', marginTop: 12 }]}
              onPress={handleRetry}
              accessibilityRole="button"
              accessibilityLabel={t('cosmeticsHub.retry')}
              testID="cosmetics-hub-retry-btn"
            >
              {t('cosmeticsHub.retry')}
            </Text>
          </View>
        ) : (
          <>
            <CosmeticsGrid cosmetics={filteredCosmetics} loading={false} onSelect={handleSelectCosmetic} highlightSeasonal={activeTab === 'seasonal'} />
            {/* Admin/Debug info for seasonal tab */}
            {activeTab === 'seasonal' && (
              <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#aaa' }}>[DEBUG] Seasonal cosmetics count: {filteredCosmetics.length}</Text>
                {filteredCosmetics.map(c => (
                  <Text key={c.id} style={{ fontSize: 12, color: '#aaa' }}>[DEBUG] ID: {c.id}, Name: {c.name}, Owned: {String(c.owned)}</Text>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  tab: { fontSize: 16, color: '#888', padding: 8 },
  activeTab: { color: '#222', fontWeight: 'bold', borderBottomWidth: 2, borderColor: '#222' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder: { color: '#aaa', fontSize: 18 },
});
