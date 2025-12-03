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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.googleLogin = exports.login = exports.register = exports.checkUsername = void 0;
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Helper to generate unique username
const generateUniqueUsername = (baseName) => __awaiter(void 0, void 0, void 0, function* () {
    // Remove special chars and spaces, make uppercase
    let base = baseName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (base.length < 3)
        base = "USER" + crypto_1.default.randomBytes(2).toString('hex').toUpperCase();
    let username = base;
    let counter = 1;
    while (true) {
        const existing = yield prisma.user.findUnique({ where: { username } });
        if (!existing)
            return username;
        username = `${base}${counter}`;
        counter++;
    }
});
const checkUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        let available = false;
        let suggestions = [];
        if (username) {
            const upperUsername = username.toUpperCase();
            const existing = yield prisma.user.findUnique({ where: { username: upperUsername } });
            available = !existing;
        }
        // Generate suggestions
        const base = username ? username.replace(/[^a-zA-Z0-9]/g, "") : "USER";
        for (let i = 0; i < 3; i++) {
            const suffix = Math.floor(1000 + Math.random() * 9000);
            const suggestion = (base + suffix).toUpperCase();
            // Check if suggestion exists (optional, but good for UX)
            const exists = yield prisma.user.findUnique({ where: { username: suggestion } });
            if (!exists)
                suggestions.push(suggestion);
        }
        res.json({ available, suggestions });
    }
    catch (error) {
        console.error("Check username error:", error);
        res.status(500).json({ error: "Failed to check username" });
    }
});
exports.checkUsername = checkUsername;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const _g = req.body, { email: rawEmail, password, role, name, username } = _g, profileData = __rest(_g, ["email", "password", "role", "name", "username"]);
        const email = rawEmail.toLowerCase();
        // Check if user exists
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Check if username exists
        const upperUsername = username ? username.toUpperCase() : yield generateUniqueUsername(name);
        const existingUsername = yield prisma.user.findUnique({ where: { username: upperUsername } });
        if (existingUsername) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        // Create User with Uppercase fields
        const user = yield prisma.user.create({
            data: Object.assign(Object.assign({ email, username: upperUsername, password: hashedPassword, role, name: name.toUpperCase(), image: role === "ARTIST" || role === "VENUE" ? profileData.image : undefined, location: role === "ARTIST" || role === "VENUE" ? (_a = profileData.location) === null || _a === void 0 ? void 0 : _a.toUpperCase() : undefined }, (role === "ARTIST" && {
                artistProfile: {
                    create: {
                        category: ((_b = profileData.category) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "UNSPECIFIED",
                        location: ((_c = profileData.location) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || "UNKNOWN",
                        bio: profileData.bio,
                        price: (_d = profileData.price) === null || _d === void 0 ? void 0 : _d.toUpperCase(),
                        image: profileData.image
                    }
                }
            })), (role === "VENUE" && {
                venueProfile: {
                    create: {
                        type: ((_e = profileData.type) === null || _e === void 0 ? void 0 : _e.toUpperCase()) || "UNSPECIFIED",
                        location: ((_f = profileData.location) === null || _f === void 0 ? void 0 : _f.toUpperCase()) || "UNKNOWN",
                        capacity: profileData.capacity ? parseInt(profileData.capacity) : undefined,
                        image: profileData.image
                    }
                }
            }))
        });
        const token = (0, auth_1.generateToken)(user.id, user.role);
        const image = role === "ARTIST" ? profileData.image : role === "VENUE" ? profileData.image : null;
        res.status(201).json({ message: "User registered successfully", token, user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username, image } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { identifier, password } = req.body; // identifier can be email or username
        // Check if identifier is email or username
        const isEmail = identifier.includes('@');
        const user = yield prisma.user.findFirst({
            where: {
                OR: [
                    { email: isEmail ? identifier.toLowerCase() : undefined },
                    { username: !isEmail ? identifier.toUpperCase() : undefined }
                ]
            },
            include: {
                artistProfile: true,
                venueProfile: true
            }
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (!user.password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = yield (0, auth_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        const image = ((_a = user.artistProfile) === null || _a === void 0 ? void 0 : _a.image) || ((_b = user.venueProfile) === null || _b === void 0 ? void 0 : _b.image);
        res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username, image } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
});
exports.login = login;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { credential, role } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ error: "Invalid Google token" });
        }
        const { email: rawEmail, name, sub: googleId, picture } = payload;
        const email = rawEmail.toLowerCase();
        let user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Register new user
            if (!role) {
                return res.status(400).json({ error: "Role is required for new registration" });
            }
            const username = yield generateUniqueUsername(name || "User");
            user = yield prisma.user.create({
                data: Object.assign(Object.assign({ email,
                    username, name: (name || "User").toUpperCase(), googleId,
                    role }, (role === "ARTIST" && {
                    artistProfile: {
                        create: {
                            category: "UNSPECIFIED",
                            location: "UNKNOWN",
                            image: picture
                        }
                    }
                })), (role === "VENUE" && {
                    venueProfile: {
                        create: {
                            type: "UNSPECIFIED",
                            location: "UNKNOWN",
                            image: picture
                        }
                    }
                }))
            });
        }
        else {
            // Link Google ID if not already linked
            if (!user.googleId) {
                yield prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        // Fetch user with profiles to get the image
        const fullUser = yield prisma.user.findUnique({
            where: { id: user.id },
            include: { artistProfile: true, venueProfile: true }
        });
        const image = ((_a = fullUser === null || fullUser === void 0 ? void 0 : fullUser.artistProfile) === null || _a === void 0 ? void 0 : _a.image) || ((_b = fullUser === null || fullUser === void 0 ? void 0 : fullUser.venueProfile) === null || _b === void 0 ? void 0 : _b.image);
        res.json({ message: "Google login successful", token, user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username, image } });
    }
    catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ error: "Google login failed" });
    }
});
exports.googleLogin = googleLogin;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail.toLowerCase();
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        yield prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires,
            },
        });
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    ${resetUrl}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        yield (0, email_1.sendEmail)(user.email, 'Password Reset Request', message);
        res.json({ message: "Email sent" });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        yield prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        res.json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Failed to reset password" });
    }
});
exports.resetPassword = resetPassword;
