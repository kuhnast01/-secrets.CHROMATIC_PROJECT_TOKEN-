import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
if (process.env.NODE_ENV !== 'test') {
    i18next.use(Backend).use(middleware.LanguageDetector).init({
        fallbackLng: 'en',
        preload: ['en', 'es', 'fr'],
        backend: {
            loadPath: path.join(__dirname, '../../locales/{{lng}}/translation.json'),
        },
    });
}
const testMiddleware = (_req, _res, next) => next();
export default process.env.NODE_ENV === 'test'
    ? testMiddleware
    : middleware.handle(i18next);
