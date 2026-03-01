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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function testUpload() {
    return __awaiter(this, void 0, void 0, function* () {
        const dummyContent = Buffer.from('Hello world');
        console.log("Attempting upload...");
        const { data, error } = yield supabase.storage
            .from('uploads')
            .upload(`test-${Date.now()}.txt`, dummyContent, {
            contentType: 'text/plain',
            upsert: false
        });
        if (error) {
            console.error("UPLOAD ERROR:");
            console.error(JSON.stringify(error, null, 2));
        }
        else {
            console.log("UPLOAD SUCCESS:", data);
        }
    });
}
testUpload();
