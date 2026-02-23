"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate3DAsset = generate3DAsset;
exports.runLLM = runLLM;
exports.synthesizeVoice = synthesizeVoice;
exports.translateText = translateText;
exports.moderateText = moderateText;
// ai-integrations.ts
// Centralized API clients and helpers for real AI integrations
const axios_1 = __importDefault(require("axios"));
async function generate3DAsset(prompt, type) {
    const url = process.env.GEN3D_API_URL;
    const key = process.env.GEN3D_API_KEY;
    if (!url || !key)
        throw new Error('GEN3D API URL or KEY not set');
    const res = await axios_1.default.post(url, { prompt, type }, { headers: { 'Authorization': `Bearer ${key}` } });
    return res.data;
}
async function runLLM(prompt) {
    const url = process.env.OPENAI_API_URL;
    const key = process.env.OPENAI_API_KEY;
    if (!url || !key)
        throw new Error('OPENAI API URL or KEY not set');
    const res = await axios_1.default.post(url, {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
    }, { headers: { 'Authorization': `Bearer ${key}` } });
    return res.data.choices[0].message.content;
}
async function synthesizeVoice(text) {
    const url = process.env.ELEVENLABS_API_URL;
    const key = process.env.ELEVENLABS_API_KEY;
    if (!url || !key)
        throw new Error('ELEVENLABS API URL or KEY not set');
    const res = await axios_1.default.post(url, { text }, { headers: { 'xi-api-key': key } });
    return res.data;
}
async function translateText(text, targetLang) {
    const url = process.env.DEEPL_API_URL;
    const key = process.env.DEEPL_API_KEY;
    if (!url || !key)
        throw new Error('DEEPL API URL or KEY not set');
    const res = await axios_1.default.post(url, null, {
        params: { auth_key: key, text, target_lang: targetLang },
    });
    return res.data.translations[0].text;
}
async function moderateText(text) {
    const url = process.env.PERSPECTIVE_API_URL;
    const key = process.env.PERSPECTIVE_API_KEY;
    if (!url || !key)
        throw new Error('PERSPECTIVE API URL or KEY not set');
    const res = await axios_1.default.post(url, {
        comment: { text },
        requestedAttributes: { TOXICITY: {} },
    }, { params: { key } });
    return res.data;
}
// Analytics and orchestration helpers would be added here as needed
