
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBattlePass } from '../state/BattlePassContext';
import type { BattlePassMission } from '../../../packages/api/src/battlePassMissionsApi';
import { getBattlePassMissions, claimBattlePassMission } from '../../../packages/api/src/battlePassMissionsApi';

const BattlePassMissionsScreen = () => {
  const { t } = useTranslation();
  const [missions, setMissions] = useState<BattlePassMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState('daily');
  const { fetchBattlePass, triggerXPAnimation } = useBattlePass();

  const fetchMissions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBattlePassMissions();
      setMissions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load missions');
    } finally {
      setLoading(false);
    }

  useEffect(() => { fetchMissions(); }, []);

  const handleClaim = async (missionId: string) => {
    setClaimingId(missionId);
    setClaimError('');
    setClaimSuccess(null);
    try {
      const res = await claimBattlePassMission(missionId);
      if (res.success) {
        setClaimSuccess(missionId);
        await fetchMissions();
        await fetchBattlePass();
        triggerXPAnimation();
      } else {
        setClaimError(res.message || 'Could not claim mission');
      }
    } catch (err: any) {
      setClaimError(err.message || 'Could not claim mission');
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color="#3182ce" accessibilityLabel={t('battlePassMissions.loading')} />;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.error}>{t(error)}</Text></View>;
  }

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color="#3182ce" accessibilityLabel="Loading Missions" />;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
  }

  // i18n resource keys required in your translation files:
  // {
  //   "battlePassMissions": {
  //     "loading": "Loading Missions...",
  //     "heading": "Battle Pass Missions",
  //     "daily": "Daily",
  //     "weekly": "Weekly",
  //     "seasonal": "Seasonal",
  //     "claimed": "Claimed",
  //     "claim": "Claim",
  //     "claiming": "Claiming...",
  //     "empty": "No {{type}} missions.",
  //     "progress": "{{progress}} / {{goal}}"
  //   }
  // }
  const missionTypes = [
    { label: t('battlePassMissions.daily'), value: 'daily' },
    { label: t('battlePassMissions.weekly'), value: 'weekly' },
    { label: t('battlePassMissions.seasonal'), value: 'seasonal' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('battlePassMissions.heading')}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
        {missionTypes.map((type) => (
          <Pressable
            key={type.value}
            onPress={() => setTab(type.value)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderBottomWidth: 3,
              borderBottomColor: tab === type.value ? '#3182ce' : 'transparent',
              marginHorizontal: 6,
            }}
          >
            <Text style={{ color: tab === type.value ? '#3182ce' : '#718096', fontWeight: 'bold', fontSize: 16 }}>{type.label}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={missions.filter(m => m.type === tab)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.missionItem}>
            <Text style={styles.missionDesc}>{item.description}</Text>
            <Text style={styles.missionReward}>{item.reward}</Text>
            <View style={styles.progressBarWrap}>
              <View style={[styles.progressBar, { width: `${Math.min(100, Math.round((item.progress / item.goal) * 100))}%` }]} />
            </View>
            <View style={styles.missionFooter}>
              <Text style={styles.missionProgress}>{t('battlePassMissions.progress', { progress: item.progress, goal: item.goal })}</Text>
              {item.claimed ? (
                <Text style={styles.claimed}>{t('battlePassMissions.claimed')}</Text>
              ) : item.progress >= item.goal ? (
                <TouchableOpacity style={styles.claimBtn} onPress={() => handleClaim(item.id)} disabled={claimingId === item.id}>
                  <Text style={styles.claimBtnText}>{claimingId === item.id ? t('battlePassMissions.claiming') : t('battlePassMissions.claim')}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#aaa', textAlign: 'center', marginTop: 24 }}>{t('battlePassMissions.empty', { type: missionTypes.find(t => t.value === tab)?.label.toLowerCase() })}</Text>}
      />
      {claimError ? <Text style={styles.error}>{t(claimError)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontWeight: 'bold', marginTop: 8 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  missionItem: { backgroundColor: '#f7fafc', borderRadius: 8, padding: 16, marginBottom: 12 },
  missionDesc: { fontSize: 16, color: '#222', marginBottom: 4 },
  missionReward: { fontSize: 14, color: '#888', marginBottom: 8 },
  progressBarWrap: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#3182ce', borderRadius: 4 },
  missionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionProgress: { fontSize: 14, color: '#222' },
  claimed: { color: '#38b2ac', fontWeight: 'bold', marginTop: 4 },
  claimBtn: { backgroundColor: '#3182ce', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8, alignItems: 'center', marginTop: 4 },
  claimBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successText: { color: 'green', fontWeight: 'bold', marginTop: 4 },
});

}
export default BattlePassMissionsScreen;
