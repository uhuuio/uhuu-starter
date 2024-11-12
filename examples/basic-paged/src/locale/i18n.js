import i18n from "i18next";
import de from "./translations/de.json";
import en from "./translations/en.json";

import { initReactI18next } from "react-i18next";
const resources = {
  de: { translation: de },
  en: { translation: en }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    interpolation: { escapeValue: false  } // react already safes from xss
  });

export default i18n;