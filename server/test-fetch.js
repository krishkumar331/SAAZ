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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
function testFetch() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting RAW Fetch upload test...");
        const dummyContent = 'Hello world';
        const url = `${supabaseUrl}/storage/v1/object/uploads/testraw-${Date.now()}.txt`;
        try {
            const res = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'Content-Type': 'text/plain'
                },
                body: dummyContent
            });
            console.log("STATUS CODE:", res.status);
            const text = yield res.text();
            console.log("RESPONSE BODY:");
            console.log(text);
        }
        catch (error) {
            console.error("RAW FETCH ERROR:", error);
        }
    });
}
testFetch();
