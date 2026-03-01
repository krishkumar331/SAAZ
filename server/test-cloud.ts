import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import fs from 'fs';
dotenv.config();

console.log("Check format:", process.env.CLOUDINARY_URL?.substring(0,25));

// If CLOUDINARY_URL is present, the SDK auto-configures itself.
// But we can force URL parsing directly by passing true:
cloudinary.config(true);

async function testCloudinaryUpload() {
  try {
    const dummyContent = Buffer.from('Hello world base64 text for testing');
    
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'saaz_uploads_test', resource_type: 'auto' }, 
        (error, result) => {
          if (error) {
             console.error("error inside stream", error);
             fs.writeFileSync('true-cloud-error.txt', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
             return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(dummyContent);
    });
    
    fs.writeFileSync('true-cloud-success.txt', JSON.stringify(result, null, 2));
    console.log("SUCCESS!", result.secure_url);

  } catch (err: any) {
    fs.writeFileSync('true-cloud-catch.txt', err?.toString() + "\n\n" + err?.stack);
    console.error("FAILED", err);
  }
}

testCloudinaryUpload();
