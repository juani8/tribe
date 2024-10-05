import { I18n as i18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import es from './translations/es';
import en from './translations/en';

const locales = RNLocalize.getLocales();

const translations = { es, en };
const I18n = new i18n(translations);

// Establecer el idioma del dispositivo como predeterminado
I18n.locale = locales[0]?.languageCode || 'es'; // Usar 'es' si no se detecta el idioma del dispositivo

// Habilitar fallback para versiones regionales (ej. 'en-US' y 'en-GB' usarán 'en')
I18n.fallbacks = true;

export default I18n;
