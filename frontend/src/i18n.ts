import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      title: 'Title',
      'validation.required': '{{field}} is required.',
      'error.sign_in.not_found': 'Invalid email or password.',
      'error.sign_in.pending_user': 'Please confirm your email before signin in.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
