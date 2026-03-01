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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
console.log("Check format:", (_a = process.env.CLOUDINARY_URL) === null || _a === void 0 ? void 0 : _a.substring(0, 25));
// If CLOUDINARY_URL is present, the SDK auto-configures itself.
// But we can force URL parsing directly by passing true:
cloudinary_1.v2.config(true);
function testCloudinaryUpload() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dummyContent = Buffer.from('Hello world base64 text for testing');
            const result = yield new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: 'saaz_uploads_test', resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        console.error("error inside stream", error);
                        fs_1.default.writeFileSync('true-cloud-error.txt', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
                        return reject(error);
                    }
                    resolve(result);
                });
                uploadStream.end(dummyContent);
            });
            fs_1.default.writeFileSync('true-cloud-success.txt', JSON.stringify(result, null, 2));
            console.log("SUCCESS!", result.secure_url);
        }
        catch (err) {
            fs_1.default.writeFileSync('true-cloud-catch.txt', (err === null || err === void 0 ? void 0 : err.toString()) + "\n\n" + (err === null || err === void 0 ? void 0 : err.stack));
            console.error("FAILED", err);
        }
    });
}
testCloudinaryUpload();
