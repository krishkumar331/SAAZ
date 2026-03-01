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
const fs_1 = __importDefault(require("fs"));
function testLiveUpload() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a dummy text file to act as the image payload
            fs_1.default.writeFileSync('dummy.jpg', 'fake image content');
            const fileData = fs_1.default.readFileSync('dummy.jpg');
            const formData = new FormData();
            const blob = new Blob([fileData], { type: 'image/jpeg' });
            formData.append('image', blob, 'dummy.jpg');
            console.log("Sending POST to https://server-lovat-rho.vercel.app/api/upload ...");
            const response = yield fetch('https://server-lovat-rho.vercel.app/api/upload', {
                method: 'POST',
                body: formData
            });
            const text = yield response.text();
            console.log("STATUS:", response.status);
            console.log("HEADERS:", response.headers);
            console.log("BODY:", text);
        }
        catch (err) {
            console.error("Test script failed:", err);
        }
    });
}
testLiveUpload();
