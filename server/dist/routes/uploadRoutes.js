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
const express_1 = require("express");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const supabase_js_1 = require("@supabase/supabase-js");
const router = (0, express_1.Router)();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
router.post('/', uploadMiddleware_1.upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        const fileExt = req.file.originalname.split('.').pop() || 'tmp';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data, error } = yield supabase.storage
            .from('avatars')
            .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
        });
        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({ error: 'Failed to upload image to Supabase' });
        }
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
        res.json({ imageUrl: publicUrlData.publicUrl });
    }
    catch (err) {
        console.error('Upload catch error:', err);
        res.status(500).json({ error: 'Internal server error during upload' });
    }
}));
exports.default = router;
