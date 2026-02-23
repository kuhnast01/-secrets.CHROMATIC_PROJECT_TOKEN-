// i18n.ts - Internationalization utilities (scaffold)
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    users: 'Users',
    shop: 'Shop',
    events: 'Events',
    // ...add more keys
  },
  es: {
    welcome: 'Bienvenido',
    users: 'Usuarios',
    shop: 'Tienda',
    events: 'Eventos',
    // ...add more keys
  },
};

let currentLang = 'en';

export function t(key: string): string {
  return translations[currentLang][key] || key;
}

export function setLang(lang: string) {
  currentLang = lang;
}
