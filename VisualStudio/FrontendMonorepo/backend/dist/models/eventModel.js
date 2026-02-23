"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEvents = getAllEvents;
exports.createEvent = createEvent;
const prisma_1 = __importDefault(require("../prisma"));
async function getAllEvents({ skip = 0, take = 20 } = {}) {
    return prisma_1.default.event.findMany({
        skip,
        take,
        orderBy: { id: 'desc' },
    });
}
async function createEvent(event) {
    const { name, config, created_by } = event;
    return prisma_1.default.event.create({
        data: {
            name,
            config,
            created_by,
        },
    });
}
