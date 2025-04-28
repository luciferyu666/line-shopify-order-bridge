import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./zh.json";
import en from "./en.json";

// 檢測瀏覽器語言，若非 zh / en 則回退 zh
const userLng = navigator.language.startsWith("en") ? "en" : "zh";

void i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: userLng,
  fallbackLng: "zh",
  interpolation: { escapeValue: false },
});

export default i18n;
