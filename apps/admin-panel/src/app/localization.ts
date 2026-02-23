// localization.ts
// Simple localization utility for multi-language support

const translations: Record<string, Record<string, string>> = {
  fr: {
    'Event Composer (Visual Builder)': 'Compositeur d\'Événements (Constructeur Visuel)',
    'Save Draft': 'Enregistrer le brouillon',
    'Preview': 'Aperçu',
    'Publish': 'Publier',
    'History': 'Historique',
    'Calendar': 'Calendrier',
    'Audit Log': 'Journal d\'audit',
    'LiveOps Analytics': 'Analytique LiveOps',
    'Active Events': 'Événements actifs',
    'Total Players': 'Joueurs totaux',
    'Engaged Players': 'Joueurs engagés',
    'Revenue': 'Revenu',
    'Event Performance': 'Performance de l\'événement',
    // ...add more keys as needed
  },
  en: {
    'Event Composer (Visual Builder)': 'Event Composer (Visual Builder)',
    'Save Draft': 'Save Draft',
    'Preview': 'Preview',
    'Publish': 'Publish',
    'History': 'History',
    'Calendar': 'Calendar',
    'Audit Log': 'Audit Log',
    'LiveOps Analytics': 'LiveOps Analytics',
    'Active Events': 'Active Events',
    'Total Players': 'Total Players',
    'Engaged Players': 'Engaged Players',
    'Revenue': 'Revenue',
    'Event Performance': 'Event Performance',
    // ...add more keys as needed
  },
  es: {
    'Event Composer (Visual Builder)': 'Compositor de Eventos (Constructor Visual)',
    'Save Draft': 'Guardar Borrador',
    'Preview': 'Vista Previa',
    'Publish': 'Publicar',
    'History': 'Historial',
    'Calendar': 'Calendario',
    'Audit Log': 'Registro de Auditoría',
    'LiveOps Analytics': 'Analítica LiveOps',
    'Active Events': 'Eventos Activos',
    'Total Players': 'Jugadores Totales',
    'Engaged Players': 'Jugadores Comprometidos',
    'Revenue': 'Ingresos',
    'Event Performance': 'Rendimiento del Evento',
    // ...add more keys as needed
  },
  // Add more languages here
};

let currentLang = 'en';
export const availableLanguages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

export function setLanguage(lang: string) {
  if (translations[lang]) currentLang = lang;
}

export function t(key: string): string {
  return translations[currentLang][key] || key;
}
