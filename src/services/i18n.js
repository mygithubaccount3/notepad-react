import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import HttpApi from "i18next-http-backend";
import {API_URL} from "../.env";

i18next
    .use(initReactI18next)
    .use(HttpApi)
    .init({
        lng: window.location.pathname.split('/')[1],
        supportedLngs: ["en", "ru"],
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: API_URL + '/locales/{{lng}}',
            crossDomain: true,
            withCredentials: true,
        },
        nonExplicitSupportedLngs: true,
        fallbackLng: "en",
        debug: process.env.NODE_ENV === 'development',
    });
export default i18next;
