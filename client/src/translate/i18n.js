import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fa from "./langs/fa.json";
import en from "./langs/en.json";
import PageEn from "./langs/pages/en.json";
import PageFa from "./langs/pages/fa.json";

i18n.use(initReactI18next).init({
  // debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, //react escapeValue automatically
  },
  resources: {
    en: {
      ...en,
      pages: {
        ...PageEn,
      },
    },
    fa: {
      ...fa,
      pages: {
        ...PageFa,
      },
    },
  },
});

export default i18n;
