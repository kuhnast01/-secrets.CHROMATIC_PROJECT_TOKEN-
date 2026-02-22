type AnalyticsClient = {
  logScreenView: (params: { screen_name: string; screen_class: string }) => Promise<void>;
  logEvent: (event: string, params?: Record<string, any>) => Promise<void>;
};

const noopClient: AnalyticsClient = {
  logScreenView: async () => {},
  logEvent: async () => {},
};

const getAnalyticsClient = (): AnalyticsClient => {
  try {
    const analyticsFactory = require('@react-native-firebase/analytics').default;
    if (typeof analyticsFactory === 'function') {
      return analyticsFactory();
    }
  } catch (_) {
    // Native Firebase module is optional in local Detox debug runs.
  }
  return noopClient;
};

export async function logScreenView(screenName: string) {
  try {
    const analytics = getAnalyticsClient();
    await analytics.logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch (_) {
    // Analytics is optional in local and Detox runs.
  }
}

export async function logEvent(event: string, params?: Record<string, any>) {
  try {
    const analytics = getAnalyticsClient();
    await analytics.logEvent(event, params);
  } catch (_) {
    // Analytics is optional in local and Detox runs.
  }
}

export default getAnalyticsClient;
