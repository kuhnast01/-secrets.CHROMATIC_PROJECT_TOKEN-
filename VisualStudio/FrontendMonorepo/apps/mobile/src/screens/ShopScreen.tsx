import React, { useState, useEffect, useRef, useCallback } from 'react';
// --- showToast helper (cross-platform) ---


/**
 * ShopItemWithOptional extends ShopItem with optional limit and purchased fields for UI logic.
 * @typedef {Object} ShopItemWithOptional
 * @property {number} [limit] - Optional purchase limit for the item.
 * @property {number} [purchased] - Optional number of times the item has been purchased.
 */
type ShopItemWithOptional = ShopItem & { limit?: number; purchased?: number };
/**
 * Cross-platform toast/alert helper for user feedback.
 * @param {string} message - The message to display.
 */
function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
}

/**
 * GamificationBar displays user level and XP progress.
 * @param {{ userProfile: { id: string; name: string; avatar: string } }} props
 */
function GamificationBar({ userProfile }: { userProfile: { id: string; name: string; avatar: string } }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8 }}>
      <Image source={{ uri: userProfile.avatar }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} accessibilityLabel={userProfile.name + ' avatar'} accessible />
      <Text style={{ fontWeight: 'bold', color: '#3182ce', fontSize: 16 }}>Level 7</Text>
      <View style={{ flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginHorizontal: 8 }}>
        <View style={{ width: '60%', height: 8, backgroundColor: '#3182ce', borderRadius: 4 }} />
      </View>
      <Text style={{ color: '#444', fontSize: 12 }}>420/700 XP</Text>
    </View>
  );
}

/**
 * OnboardingModal shows a welcome message and onboarding info for the shop.
 * @param {{ visible: boolean; onClose: () => void }} props
 */
function OnboardingModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="fade" transparent accessibilityViewIsModal accessibilityLabel="Onboarding modal">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, width: '85%', padding: 20, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>Welcome to the Shop!</Text>
          <Text style={{ color: '#666', fontSize: 15, marginBottom: 16, textAlign: 'center' }}>
            Here you can purchase items, gift friends, and earn rewards. Explore the tabs and enjoy exclusive offers!
          </Text>
          <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#3182ce', padding: 10, borderRadius: 8 }} accessibilityRole="button" accessibilityLabel="Close onboarding modal">
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput, FlatList, ToastAndroid, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Sentry from '../sentry';
import { logScreenView, logEvent } from '../analytics';
import ErrorBoundary from '../components/ErrorBoundary';
import { ShopResponse, ShopItem, purchaseShopItem, PurchaseResponse, giftShopItem } from '@api/src/shopApi';
import { isShopItemExpired } from '@api/src/shopTimerUtils';
import { useGlobalNow } from '../hooks/useGlobalTimer';
import { useFeaturedShop, useSeasonalShop } from '../hooks/useShop';
import { useShopTabsConfig } from '../config/shopConfig';
import { differenceInDays } from 'date-fns';
import { ShopItemCard } from '../components/ShopItemCard';
import GiftFriendModal, { Friend } from '../components/GiftFriendModal';
import ShopItemSkeleton from '../components/ShopItemSkeleton';
import CurrencyHeader from '../components/CurrencyHeader';
import { RewardPopup } from '../components/RewardPopup';
/**
 * InviteFriendModal allows users to invite a friend by name.
 * @param {{ visible: boolean; onClose: () => void; onInvite: (name: string) => void }} props
 */
function InviteFriendModal({ visible, onClose, onInvite }: { visible: boolean; onClose: () => void; onInvite: (name: string) => void }) {
  const [input, setInput] = useState('');
  return (
    <Modal visible={visible} animationType="fade" transparent accessibilityViewIsModal accessibilityLabel="Invite friend modal">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, width: '80%', padding: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }} accessibilityRole="header" accessibilityLabel="Invite a Friend">Invite a Friend</Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Enter friend name..."
            style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 8, marginBottom: 12 }}
            accessibilityLabel="Enter friend name"
            accessible
          />
          <TouchableOpacity
            onPress={() => {
              if (input.trim()) {
                onInvite(input.trim());
                setInput('');
              }
            }}
            style={{ backgroundColor: '#3182ce', padding: 8, borderRadius: 8, marginBottom: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Send invite"
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send Invite</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end' }} accessibilityRole="button" accessibilityLabel="Close invite modal">
            <Text style={{ color: '#3182ce', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * ChatModal provides a simple real-time chat UI for friends.
 * @param {{ visible: boolean; onClose: () => void; friends: any[]; userProfile: any }} props
 */
function ChatModal({ visible, onClose, friends, userProfile }: { visible: boolean; onClose: () => void; friends: any[]; userProfile: any }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alice', text: 'Hey! Ready to shop?' },
    { id: 2, sender: 'You', text: 'Absolutely! Let’s go.' },
  ]);
  const [input, setInput] = useState('');
  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: userProfile.name, text: input }]);
    setInput('');
  };
  return (
    <Modal visible={visible} animationType="slide" transparent accessibilityViewIsModal accessibilityLabel="Friend chat modal">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, width: '90%', maxHeight: '70%', padding: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }} accessibilityRole="header" accessibilityLabel="Friend Chat">Friend Chat</Text>
          <FlatList
            data={messages}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'center' }}>
                <Text style={{ fontWeight: item.sender === userProfile.name ? 'bold' : 'normal', color: item.sender === userProfile.name ? '#3182ce' : '#222', marginRight: 6 }}>{item.sender}:</Text>
                <Text style={{ color: '#444' }}>{item.text}</Text>
              </View>
            )}
            style={{ marginBottom: 8, maxHeight: 180 }}
            accessible
          />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 8, marginBottom: 8 }}
            accessibilityLabel="Type a message"
            accessible
          />
          <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: '#3182ce', padding: 8, borderRadius: 8 }} accessibilityRole="button" accessibilityLabel="Send message">
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 12, alignSelf: 'flex-end' }} accessibilityRole="button" accessibilityLabel="Close chat modal">
            <Text style={{ color: '#3182ce', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * ShopScreen is the main shop UI, handling shop tabs, purchases, gifting, and social features.
 * Includes onboarding, gamification, and accessibility enhancements.
 *
 * Features:
 * - Dynamic shop tabs (Contentful-driven)
 * - Purchase and gifting flows
 * - Friend invite and chat modals
 * - Gamification bar and onboarding modal
 * - Accessibility and performance optimizations
 *
 * @component
 */
function ShopScreen() {
  // Social features state
  const [chatVisible, setChatVisible] = useState<boolean>(false);
  const [inviteVisible, setInviteVisible] = useState<boolean>(false);
  const [onboardingVisible, setOnboardingVisible] = useState<boolean>(true);
  // Log screen view for analytics
  useEffect(() => {
    logScreenView('ShopScreen');
  }, []);
  // Network status fallback (native NetInfo is optional in current debug build)
  const netInfo = { isConnected: true, details: null as any };
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('featured');
  const navigation = useNavigation();
  const featuredShop = useFeaturedShop();
  const seasonalShop = useSeasonalShop();
  const [reward, setReward] = useState<PurchaseResponse['reward'] | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  // Track timer expiry for auto-refresh
  const timerIntervals = useRef<NodeJS.Timeout[]>([]);
  const now = useGlobalNow();
  // Contentful-driven shop tabs
  const { tabs: SHOP_TABS_CONFIG, loading: tabsLoading, error: tabsError } = useShopTabsConfig();
  // User profile (mocked for now)
  interface UserProfile { id: string; name: string; avatar: string; }
  const [userProfile] = useState<UserProfile>({
    id: 'user1',
    name: 'You',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  });
  // Friends (mocked)
  interface FriendProfile { id: string; name: string; avatar: string; }
  const [friends] = useState<FriendProfile[]>([
    { id: 'f1', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 'f2', name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  ]);
  // Gift modal state
  const [giftModalVisible, setGiftModalVisible] = useState<boolean>(false);
  const [giftItem, setGiftItem] = useState<ShopItemWithOptional | null>(null);
  const [giftLoading, setGiftLoading] = useState<boolean>(false);
  const [giftError, setGiftError] = useState<string | null>(null);

  // Set items, isLoading, error, and refetch after hooks are defined
  let items: ShopItemWithOptional[] = [];
  let isLoading = false;
  let error = null;
  let refetch = () => {};
  if (activeTab === 'seasonal') {
    items = seasonalShop.data || [];
    isLoading = seasonalShop.isLoading;
    error = seasonalShop.error;
    refetch = seasonalShop.refetch;
  } else {
    items = featuredShop.data || [];
    isLoading = featuredShop.isLoading;
    error = featuredShop.error;
    refetch = featuredShop.refetch;
  }
  // Filter out expired items on the client side
  items = items.filter(item => !isShopItemExpired(item, now));

  // Auto-refresh shop data when any timer expires
  useEffect(() => {
    timerIntervals.current.forEach(clearTimeout);
    timerIntervals.current = [];
    if (!items) return;
    const now = Date.now();
    items.forEach(item => {
      if (item.timer && item.available) {
        const end = new Date(item.timer).getTime();
        const ms = end - now;
        if (ms > 0) {
          const timeout = setTimeout(() => {
            refetch();
          }, ms + 1000);
          timerIntervals.current.push(timeout);
        }
      }
    });
    return () => {
      timerIntervals.current.forEach(clearTimeout);
      timerIntervals.current = [];
    };
  }, [items, refetch]);

  // Purchase handler
  const handlePurchase = useCallback(async (item: ShopItem) => {
    setLoadingId(item.id);
    setPurchaseError(null);
    try {
      const res = await purchaseShopItem({ itemId: item.id, tab: activeTab });
      if (res.success) {
        setReward(res.reward);
        refetch();
        logEvent('purchase', { itemId: item.id, tab: activeTab });
      } else {
        setPurchaseError(res.error || 'Purchase failed.');
        Sentry.captureMessage(res.error || 'Purchase failed.');
      }
    } catch (e: any) {
      setPurchaseError(e?.message || 'Network error.');
      Sentry.captureException(e);
    } finally {
      setLoadingId(null);
    }
  }, [activeTab, refetch]);

  // Gift handler
  const handleGift = useCallback((item: ShopItemWithOptional) => {
    setGiftItem(item);
    setGiftModalVisible(true);
    setGiftError(null);
  }, []);

  // Invite friend handler
  const handleInviteFriend = useCallback((name: string) => {
    setInviteVisible(false);
    showToast(`Invite sent to ${name}!`);
  }, []);

  // Tabs loading/error UI
  if (tabsLoading) {
    return (
      <View style={styles.container} accessibilityLabel={t('shopScreen.loadingTabs')}>
        <Text style={styles.header}>{t('shopScreen.header')}</Text>
        <Text>{t('shopScreen.loadingTabs')}</Text>
        {!netInfo.isConnected && (
          <Text style={{ color: 'orange', marginTop: 8 }}>{t('shopScreen.offline', 'You are offline. Some features may not work.')}</Text>
        )}
        {netInfo.isConnected && netInfo.details && netInfo.details.isConnectionExpensive && (
          <Text style={{ color: 'orange', marginTop: 8 }}>{t('shopScreen.slowNetwork', 'Your network is slow. Loading may take longer.')}</Text>
        )}
      </View>
    );
  }
  if (tabsError) {
    return (
      <View style={styles.container} accessibilityLabel={t('shopScreen.failedTabs')}>
        <Text style={styles.header}>{t('shopScreen.header')}</Text>
        <Text style={{ color: 'red' }}>{t('shopScreen.failedTabs')}</Text>
        <TouchableOpacity onPress={() => { refetch(); }} style={{ marginTop: 16, backgroundColor: '#3182ce', padding: 10, borderRadius: 8 }} accessibilityRole="button">
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('shopScreen.retry')}</Text>
        </TouchableOpacity>
        {!netInfo.isConnected && (
          <Text style={{ color: 'orange', marginTop: 8 }}>{t('shopScreen.offline', 'You are offline. Some features may not work.')}</Text>
        )}
      </View>
    );
  }

  // Memoized renderItem for FlatList
  const renderShopItem = useCallback(({ item }: { item: ShopItemWithOptional }) => {
    let purchaseLimitText = undefined;
    if (!item.available) {
      purchaseLimitText = t('shopScreen.soldOut');
    } else if (
      typeof item.limit === 'number' && typeof item.purchased === 'number' && item.limit > 0
    ) {
      const remaining = Math.max(0, item.limit - item.purchased);
      purchaseLimitText = t('shopScreen.remaining', { remaining, limit: item.limit });
    }
    return (
      <ShopItemCard
        name={item.name}
        rarity={item.type}
        price={item.price}
        currency={item.currency}
        imageUrl={item.imageUrl}
        purchaseLimit={purchaseLimitText}
        disabled={!item.available || loadingId === item.id}
        timer={item.timer}
        onPurchase={() => handlePurchase(item)}
        onGift={() => { handleGift(item); }}
      />
    );
  }, [t, loadingId, handlePurchase, handleGift]);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <CurrencyHeader showSeasonal={activeTab === 'seasonal'} highlightSeasonal={activeTab === 'seasonal'} />
        <GamificationBar userProfile={userProfile} />
        <OnboardingModal visible={onboardingVisible} onClose={() => { setOnboardingVisible(false); }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} accessibilityRole="header">
          <Text style={styles.header}>{t('shopScreen.header')}</Text>
          <TouchableOpacity
            style={{ padding: 8, backgroundColor: '#3182ce', borderRadius: 8 }}
            onPress={() => { navigation.navigate('PurchaseHistory' as never); }}
            accessibilityRole="button"
            accessibilityLabel={t('shopScreen.history')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('shopScreen.history')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabBar} accessibilityRole="tablist">
          {SHOP_TABS_CONFIG.map((tab: any) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => { setActiveTab(tab.key); }}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab.key }}
              accessibilityLabel={tab.label}
            >
              <Text style={[styles.tabIcon, activeTab === tab.key && styles.activeTabIcon]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
          {/* Tab stubs for Arena, Raid, Guild, Faction */}
          {['arena', 'raid', 'guild', 'faction'].map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, activeTab === key && styles.activeTab, styles.stubTab]}
              onPress={() => { setActiveTab(key); }}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === key }}
              accessibilityLabel={t('shopScreen.comingSoon', { tab: key.charAt(0).toUpperCase() + key.slice(1) })}
            >
              <Text style={activeTab === key ? styles.activeTabLabel : styles.tabLabel}>{t('shopScreen.comingSoon', { tab: key.charAt(0).toUpperCase() + key.slice(1) }).split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Show banner, description, and season countdown for the active tab, or stub content for stubs */}
        {(() => {
          const tab = SHOP_TABS_CONFIG.find((t: any) => t.key === activeTab);
          const isStub = ['arena', 'raid', 'guild', 'faction'].includes(activeTab);
          if (isStub) {
            return (
              <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 16 }}>
                <Text style={{ fontSize: 20, color: '#aaa', fontWeight: 'bold', marginBottom: 8 }}>{t('shopScreen.comingSoon', { tab: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) })}</Text>
                <Text style={{ color: '#444', fontSize: 15 }}>{t('shopScreen.comingSoonDesc')}</Text>
              </View>
            );
          }
          if (!tab) return null;
          const isSeasonal = tab.key === 'seasonal';
          let daysLeft = null;
          if (isSeasonal && tab.seasonEnd) {
            try {
              daysLeft = differenceInDays(new Date(tab.seasonEnd), new Date());
            } catch {}
          }
          return (
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              {tab.bannerImage && (
                <View style={{ marginBottom: 8 }}>
                  <Image source={{ uri: tab.bannerImage }} style={{ width: 320, height: 80, borderRadius: 12 }} resizeMode="cover" accessibilityLabel="Shop banner" accessible />
                </View>
              )}
              {isSeasonal && daysLeft !== null && daysLeft >= 0 && (
                <Text style={{ color: '#e67e22', fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                  {t('shopScreen.seasonEnds', { count: daysLeft })}
                </Text>
              )}
              {tab.description && <Text style={{ color: '#444', fontSize: 14 }}>{tab.description}</Text>}
            </View>
          );
        })()}
        <View style={styles.content} accessibilityLabel={t('shopScreen.header') + ' content'}>
          {isLoading && (
            <View style={{ width: '100%' }}>
              {[...Array(4)].map((_, i) => (
                <ShopItemSkeleton key={i} />
              ))}
            </View>
          )}
          {Boolean(error) && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>{t('shopScreen.failedShop')}</Text>
              <TouchableOpacity onPress={() => { refetch(); }} style={{ marginTop: 8, backgroundColor: '#3182ce', padding: 8, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('shopScreen.retry')}</Text>
              </TouchableOpacity>
            </View>
          )}
          {purchaseError && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>{purchaseError}</Text>
              {purchaseError === t('shopScreen.soldOut') && (
                <Text style={{ color: '#444', marginTop: 4 }}>{t('shopScreen.soldOut')}</Text>
              )}
              {purchaseError === 'Insufficient currency' && (
                <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#3182ce', padding: 8, borderRadius: 8 }} onPress={() => { navigation.navigate('Shop' as never); }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('shopScreen.getMoreCurrency')}</Text>
                </TouchableOpacity>
              )}
              {purchaseError === 'Shop expired' && (
                <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#3182ce', padding: 8, borderRadius: 8 }} onPress={() => { refetch(); }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('shopScreen.refreshShop')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {!isLoading && !error && items && items.length === 0 && <Text>{t('shopScreen.noItems')}</Text>}
          {!isLoading && !error && items && items.length > 0 && (
            <View style={{ width: '100%' }}>
              <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={renderShopItem}
                ListFooterComponent={
                  <>
                    <GiftFriendModal
                      visible={giftModalVisible}
                      friends={friends}
                      onSelect={friend => {
                        if (!giftItem) return;
                        setGiftLoading(true);
                        setGiftError(null);
                        giftShopItem({ itemId: giftItem.id, tab: activeTab, recipientId: friend.id })
                          .then(res => {
                            if (res.success) {
                              setReward(res.reward);
                              setGiftModalVisible(false);
                              refetch();
                            } else {
                              setGiftError(res.error || 'Gift failed.');
                            }
                          })
                          .catch(e => { setGiftError(e?.message || 'Network error.'); })
                          .finally(() => { setGiftLoading(false); });
                        showToast(`Gift sent to ${friend.name}!`);
                      }}
                      onClose={() => { setGiftModalVisible(false); }}
                    />
                    {giftError && <Text style={{ color: 'red', marginTop: 8 }}>{giftError}</Text>}
                    {giftLoading && <Text style={{ color: '#3182ce', marginTop: 8 }}>{t('shopScreen.gifting')}</Text>}
                  </>
                }
                contentContainerStyle={{ paddingBottom: 16 }}
                accessibilityLabel={t('shopScreen.header') + ' item list'}
              />
            </View>
          )}
          <RewardPopup
            visible={!!reward}
            imageUrl={reward?.imageUrl}
            name={reward?.name || ''}
            amount={reward?.amount || 0}
            rarity={reward?.rarity || ''}
            onContinue={() => { setReward(null); }}
            {...(reward && 'description' in reward ? { description: (reward as any).description } : {})}
          />
        </View>
        {/* User Profile & Social Section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 8, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: userProfile.avatar }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} accessibilityLabel={userProfile.name + ' avatar'} accessible />
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{userProfile.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => { setChatVisible(true); }} style={{ backgroundColor: '#3182ce', padding: 8, borderRadius: 8, marginRight: 8 }} accessibilityRole="button" accessibilityLabel="Open chat with friends">
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setInviteVisible(true); }} style={{ backgroundColor: '#4caf50', padding: 8, borderRadius: 8 }} accessibilityRole="button" accessibilityLabel="Invite a new friend">
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Invite Friend</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ChatModal visible={chatVisible} onClose={() => { setChatVisible(false); }} friends={friends} userProfile={userProfile} />
        <InviteFriendModal visible={inviteVisible} onClose={() => { setInviteVisible(false); }} onInvite={handleInviteFriend} />
      </View>
    </ErrorBoundary>
  );
}

export default ShopScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  tabBar: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#f0f0f0', marginRight: 8 },
  stubTab: { borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  activeTab: { backgroundColor: '#e6f7ff' },
  tabIcon: { fontSize: 18, marginRight: 6, color: '#888' },
  activeTabIcon: { color: '#3182ce' },
  tabLabel: { fontSize: 16, color: '#888' },
  activeTabLabel: { color: '#222', fontWeight: 'bold' },
  content: { minHeight: 300, justifyContent: 'center', alignItems: 'center' },
});
