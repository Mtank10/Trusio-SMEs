import i18next from "i18next"
import Backend from "i18next-fs-backend"
import middleware from "i18next-http-middleware"
import path from "path"

i18next.use(
    Backend
).use(
    middleware.LanguageDetector
).init({
    fallbackLng: "en",
    preload: ["en", "hi", "te", "ta", "kn", "ml", "mr", "bn", "pa", "or", "gu"],
    backend: {
        loadPath: path.join(__dirname, "../locales/{{lng}}.json"),
    },
});

export default middleware.handle(i18next)