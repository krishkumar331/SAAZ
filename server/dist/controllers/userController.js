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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteProfile = exports.updateProfile = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                artistProfile: true,
                venueProfile: true,
                events: true,
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { password } = user, userData = __rest(user, ["password"]);
        res.json(userData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        console.log("Update Profile Request:", { userId, body: req.body });
        const _b = req.body, { name, role } = _b, profileData = __rest(_b, ["name", "role"]);
        // Update User basic info
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: Object.assign(Object.assign({ name,
                role }, (profileData.image && { image: profileData.image })), (profileData.location && { location: profileData.location })),
        });
        console.log("Updated User Role:", updatedUser.role);
        // Handle Role Specific Profiles
        if (updatedUser.role === 'ARTIST') {
            console.log("Updating/Creating Artist Profile");
            // Upsert: Update if exists, Create if not
            yield prisma.artistProfile.upsert({
                where: { userId },
                update: {
                    bio: profileData.bio,
                    location: profileData.location,
                    price: profileData.price,
                    image: profileData.image,
                    category: profileData.category,
                },
                create: {
                    userId,
                    category: profileData.category || "Unspecified",
                    location: profileData.location || "Unknown",
                    bio: profileData.bio,
                    price: profileData.price,
                    image: profileData.image,
                }
            });
        }
        else if (updatedUser.role === 'VENUE') {
            console.log("Updating/Creating Venue Profile");
            yield prisma.venueProfile.upsert({
                where: { userId },
                update: {
                    lookingFor: profileData.lookingFor,
                    location: profileData.location,
                    capacity: profileData.capacity,
                    image: profileData.image,
                },
                create: {
                    userId,
                    type: "Unspecified", // Default
                    location: profileData.location || "Unknown",
                    lookingFor: profileData.lookingFor,
                    capacity: profileData.capacity,
                    image: profileData.image,
                }
            });
        }
        res.json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});
exports.updateProfile = updateProfile;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        // Delete related profiles first (cascade delete should handle this if configured, but explicit is safer)
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if ((user === null || user === void 0 ? void 0 : user.role) === 'ARTIST') {
            yield prisma.artistProfile.delete({ where: { userId } });
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === 'VENUE') {
            yield prisma.venueProfile.delete({ where: { userId } });
        }
        // Delete user
        yield prisma.user.delete({ where: { id: userId } });
        res.json({ message: "Profile deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete profile" });
    }
});
exports.deleteProfile = deleteProfile;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.query;
        const whereClause = {};
        if (role) {
            whereClause.role = role;
        }
        const users = yield prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                role: true,
                artistProfile: true,
                venueProfile: true,
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
exports.getAllUsers = getAllUsers;
