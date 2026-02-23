
import { useTranslation } from 'react-i18next';

// i18n resource keys required in your translation files:
// {
//   "currencyHeader": {
//     "gems": "Gems",
//     "gold": "Gold",
//     "seasonal": "Seasonal",
//     "prestige": "Prestige",
//     "prestigetoken": "Prestige Token",
//     "token": "Token"
//   }
// }

const currencyIcons: Record<string, string> = {
  gems: '💎',
  gold: '🪙',
  seasonal: '🎟️',
  prestige: '🏅',
  prestigetoken: '🏅',
  token: '🪙', // fallback for prestige tokens
};


export default function CurrencyHeader({ showSeasonal = true, highlightSeasonal = false }: { showSeasonal?: boolean, highlightSeasonal?: boolean } = {}) {
  const { t } = useTranslation();
  const { player } = usePlayer();
  if (!player || !player.currencies) return null;
  return (
    <View style={styles.header}>
      {player.currencies
        .filter(c => showSeasonal || c.name.toLowerCase() !== 'seasonal')
        .map(currency => {
          const name = currency.name.toLowerCase();
          const isSeasonal = name === 'seasonal';
          const isPrestige = name === 'prestige' || name === 'token' || name === 'prestigetoken';
          // Use icon by lowercased name, fallback to token, then generic
          const icon = currencyIcons[name] || (isPrestige ? currencyIcons.prestige : currencyIcons.token) || '💰';
          // Use i18n for label
          const label = t(`currencyHeader.${name}`, name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, s => s.toUpperCase()));
          return (
            <View key={currency.id} style={[styles.currency, isSeasonal && highlightSeasonal && styles.seasonalCurrency, isPrestige && styles.prestigeCurrency]}>
              <Text style={[styles.icon, isSeasonal && highlightSeasonal && styles.seasonalIcon, isPrestige && styles.prestigeIcon]}>{icon}</Text>
              <Text style={[styles.name, isSeasonal && highlightSeasonal && styles.seasonalName, isPrestige && styles.prestigeName]}>{label}:</Text>
              <Text style={[styles.amount, isSeasonal && highlightSeasonal && styles.seasonalAmount, isPrestige && styles.prestigeAmount]}>{currency.amount}</Text>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  seasonalCurrency: {
    backgroundColor: '#fffbe6',
    borderColor: '#e67e22',
    borderWidth: 1,
  },
  seasonalIcon: {
    color: '#e67e22',
  },
  seasonalName: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  seasonalAmount: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 18,
    marginRight: 2,
  },
  name: {
    fontSize: 15,
    color: '#888',
    marginRight: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  prestigeCurrency: {
    backgroundColor: '#f0f6ff',
    borderColor: '#3182ce',
    borderWidth: 1,
  },
  prestigeIcon: {
    color: '#3182ce',
  },
  prestigeName: {
    color: '#3182ce',
    fontWeight: 'bold',
  },
  prestigeAmount: {
    color: '#3182ce',
    fontWeight: 'bold',
  },
});
