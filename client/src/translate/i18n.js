import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fa from "./langs/fa.json";
import en from "./langs/en.json";

i18n.use(initReactI18next).init({
  // debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, //react escapeValue automatically
  },
  resources: {
    en,
    fa,
  },
});

export default i18n;
