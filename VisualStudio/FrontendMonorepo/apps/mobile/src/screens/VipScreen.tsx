
import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
// Import your custom hooks and components:
import { useVip, useVipUpgrade } from '../../hooks/vipHooks';
import VipXpBar from '../../components/VipXpBar';
import VipPerkList from '../../components/VipPerkList';
import VipUpgradeBanner from '../../components/VipUpgradeBanner';
import VipUpgradeModal from '../../components/VipUpgradeModal';
import VipLevelCard from '../../components/VipLevelCard';

export default function VipScreen() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useVip();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);
  const { mutate: upgradeVip, isLoading: upgrading } = useVipUpgrade();

  // i18n resource keys required in your translation files:
  // {
  //   "vipScreen": {
  //     "header": "VIP Ladder",
  //     "failed": "Failed to load VIP data.",
  //     "retry": "Retry",
  //     "currentLevel": "Current VIP Level: {{level}}",
  //     "perks": "Perks:",
  //     "ladderHeader": "VIP Ladder",
  //     "upgradeSuccess": "VIP upgraded!",
  //     "upgradeFailed": "Upgrade failed.",
  //     "upgradeFailedTryAgain": "Upgrade failed. Please try again.",
  //     "xpInfo": "Earn VIP XP by making purchases, completing special events, and participating in daily activities. Check the VIP Ladder for more details."
  //   }
  // }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('vipScreen.header')}</Text>
      {isLoading && <ActivityIndicator style={{ marginTop: 32 }} size="large" color="#888" accessibilityLabel={t('vipScreen.header')} />}
      {error && (
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: 'red', marginBottom: 8 }}>{t('vipScreen.failed')}</Text>
          <Button title={t('vipScreen.retry')} onPress={() => refetch()} />
        </View>
      )}
      {data && (
        <>
          <View style={styles.summaryBox}>
            <Text style={styles.currentLevel}>{t('vipScreen.currentLevel', { level: data.currentLevel })}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
              <VipXpBar currentXp={data.currentXp} nextLevelXp={data.nextLevelXp} animate />
              <Text
                style={{ color: '#3182ce', fontSize: 22, marginLeft: 8 }}
                onPress={() => alert(t('vipScreen.xpInfo'))}
                accessibilityLabel={t('vipScreen.xpInfo')}
              >
                ?
              </Text>
            </View>
            <View style={styles.perks}>
              <Text>{t('vipScreen.perks')}</Text>
              <VipPerkList perks={data.levels[data.currentLevel - 1]?.perks || []} />
            </View>
          </View>
          {/* VIP Upgrade CTA */}
          {data.currentLevel < data.levels.length && (
            <VipUpgradeBanner
              nextLevel={data.currentLevel + 1}
              nextPerks={data.levels[data.currentLevel]?.perks || []}
              nextDaily={data.levels[data.currentLevel]?.dailyReward || ''}
              onUpgrade={() => {
                setUpgradeMessage(null);
                upgradeVip(undefined, {
                  onSuccess: (res) => {
                    if (res.success) {
                      setUpgradeMessage(t('vipScreen.upgradeSuccess'));
                    } else {
                      setUpgradeMessage(res.message || t('vipScreen.upgradeFailed'));
                    }
                  },
                  onError: () => setUpgradeMessage(t('vipScreen.upgradeFailedTryAgain')),
                });
              }}
              onShowModal={() => setShowUpgradeModal(true)}
              upgrading={upgrading}
            />
          )}
          {upgradeMessage && (
            <Text style={{ color: upgradeMessage.includes(t('vipScreen.upgradeSuccess')) ? 'green' : 'red', marginVertical: 12 }}>{upgradeMessage}</Text>
          )}
          <VipUpgradeModal
            visible={showUpgradeModal}
            nextLevel={data.currentLevel + 1}
            nextPerks={data.levels[data.currentLevel]?.perks || []}
            nextDaily={data.levels[data.currentLevel]?.dailyReward || ''}
            onClose={() => setShowUpgradeModal(false)}
          />
          <Text style={styles.ladderHeader}>{t('vipScreen.ladderHeader')}</Text>
          <ScrollView style={styles.ladder} contentContainerStyle={{ paddingBottom: 32 }}>
            {data.levels.map(level => (
              <VipLevelCard
                key={level.level}
                level={level.level}
                perks={level.perks}
                dailyReward={level.dailyReward}
                locked={level.level > data.currentLevel}
                current={level.level === data.currentLevel}
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  summaryBox: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 24 },
  currentLevel: { fontSize: 20, fontWeight: 'bold' },
  xpBarContainer: { marginVertical: 12 },
  xpText: { fontSize: 14, color: '#666' },
  xpBarBg: { backgroundColor: '#eee', borderRadius: 8, height: 16, width: '100%', marginTop: 4 },
  xpBarFill: { backgroundColor: '#3182ce', height: '100%', borderRadius: 8, position: 'absolute', left: 0, top: 0 },
  perks: { fontSize: 16, marginTop: 8 },
  ladderHeader: { fontWeight: 'bold', fontSize: 18, marginVertical: 16 },
  ladder: { maxHeight: 320, borderWidth: 1, borderColor: '#eee', borderRadius: 8, backgroundColor: '#fff' },
  levelRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', opacity: 1 },
  currentLevelRow: { backgroundColor: '#e6f7ff' },
  lockedLevelRow: { opacity: 0.5 },
  levelNum: { fontWeight: 'bold', fontSize: 16, width: 70 },
  levelPerks: { flex: 1, color: '#666', fontSize: 14 },
  levelXp: { marginLeft: 8, fontSize: 13, color: '#888' },
  levelDaily: { marginLeft: 8, fontSize: 13, color: '#888' },
});
