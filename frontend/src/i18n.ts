import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      title: 'Title',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      passwordConfirmation: 'Confirm password',
      'validation.required': '{{field}} is required.',
      'validation.invalid_email': '{{field}} is invalid.',
      'validation.does_not_match_confirmation': '{{field}} does not match confirmation.',
      'validation.not_available': '{{field}} is already taken.',
      'validation.length_min_8_chars': '{{field}} too small. Minimum 8 characters.',
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
