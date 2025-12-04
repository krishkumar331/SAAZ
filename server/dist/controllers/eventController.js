"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        console.log("Create Event Request User:", req.user);
        // Check if user is a VENUE or ARTIST
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'VENUE' && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== 'ARTIST') {
            return res.status(403).json({ error: "Only Venues or Artists can create events" });
        }
        console.log("Create Event Body:", req.body);
        const { title, date, location, description, price, image } = req.body;
        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }
        const event = yield prisma.event.create({
            data: {
                title,
                date: new Date(date),
                location,
                description,
                price,
                image,
                creatorId: userId
            }
        });
        console.log("Event Created in DB:", event);
        res.status(201).json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create event" });
    }
});
exports.createEvent = createEvent;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany({
            include: {
                creator: {
                    select: {
                        name: true,
                        role: true,
                        venueProfile: { select: { type: true } },
                        artistProfile: { select: { category: true } }
                    }
                }
            },
            orderBy: { date: 'asc' }
        });
        res.json(events);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});
exports.getEvents = getEvents;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                creator: {
                    select: {
                        name: true,
                        role: true
                    }
                }
            }
        });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch event" });
    }
});
exports.getEventById = getEventById;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { title, date, location, description, price, image } = req.body;
        const event = yield prisma.event.findUnique({
            where: { id: parseInt(id) }
        });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        if (event.creatorId !== userId) {
            return res.status(403).json({ error: "Unauthorized to update this event" });
        }
        const updatedEvent = yield prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                title,
                date: date ? new Date(date) : undefined,
                location,
                description,
                price,
                image
            }
        });
        res.json(updatedEvent);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update event" });
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const event = yield prisma.event.findUnique({
            where: { id: parseInt(id) }
        });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        if (event.creatorId !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this event" });
        }
        yield prisma.event.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Event deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete event" });
    }
});
exports.deleteEvent = deleteEvent;
