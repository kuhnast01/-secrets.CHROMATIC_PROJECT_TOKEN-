"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const path_1 = __importDefault(require("path"));
if (process.env.NODE_ENV !== 'test') {
    i18next_1.default.use(i18next_fs_backend_1.default).use(i18next_http_middleware_1.default.LanguageDetector).init({
        fallbackLng: 'en',
        preload: ['en', 'es', 'fr'],
        backend: {
            loadPath: path_1.default.join(__dirname, '../../locales/{{lng}}/translation.json'),
        },
    });
}
const testMiddleware = (_req, _res, next) => next();
exports.default = process.env.NODE_ENV === 'test'
    ? testMiddleware
    : i18next_http_middleware_1.default.handle(i18next_1.default);
