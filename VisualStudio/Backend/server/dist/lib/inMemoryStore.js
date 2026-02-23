"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemory = void 0;
exports.savePlayer = savePlayer;
exports.getPlayer = getPlayer;
exports.inMemory = {
    players: new Map(),
    fleets: new Map(),
};
function savePlayer(id, payload) {
    exports.inMemory.players.set(id, payload);
}
function getPlayer(id) {
    return exports.inMemory.players.get(id) || null;
}
