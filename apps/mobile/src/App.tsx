import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegisterScreen } from './screens/RegisterScreen';
import { BattlePassProvider } from './state/BattlePassContext';
import ErrorBoundary from './components/ErrorBoundary';

const Stack = createNativeStackNavigator();

function RegisteredRoutes() {
  const SummonHubScreen = require('./screens/SummonHubScreen').default;
  const ShopScreen = require('./screens/ShopScreen').default;
  const PurchaseHistoryScreen = require('./screens/PurchaseHistoryScreen').default;

  return (
    <>
      <Stack.Screen name="SummonHub" component={SummonHubScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
    </>
  );
}

export default function App() {
  const [registered, setRegistered] = React.useState(false);

  return (
    <ErrorBoundary>
      <BattlePassProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!registered ? (
              <Stack.Screen name="Register">
                {() => <RegisterScreen onRegister={() => { setRegistered(true); }} />}
              </Stack.Screen>
            ) : (
              <RegisteredRoutes />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </BattlePassProvider>
    </ErrorBoundary>
  );
}
