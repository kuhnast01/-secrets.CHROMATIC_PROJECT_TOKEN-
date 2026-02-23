"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = t;
exports.setLang = setLang;
// i18n.ts - Internationalization utilities (scaffold)
const translations = {
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
function t(key) {
    return translations[currentLang][key] || key;
}
function setLang(lang) {
    currentLang = lang;
}
