import fs from 'fs';

async function testLiveUpload() {
  try {
    // Create a dummy text file to act as the image payload
    fs.writeFileSync('dummy.jpg', 'fake image content for format testing');
    
    const fileData = fs.readFileSync('dummy.jpg');
    const formData = new FormData();
    const blob = new Blob([fileData], { type: 'image/jpeg' });
    formData.append('image', blob, 'dummy.jpg');

    console.log("Sending POST to https://saaz-server-lovat-rho.vercel.app/api/upload ...");
    
    const response = await fetch('https://server-lovat-rho.vercel.app/api/upload', {
      method: 'POST',
      body: formData
    });

    const text = await response.text();
    console.log("STATUS:", response.status);
    console.log("HEADERS:", response.headers);
    console.log("BODY:", text);
    
  } catch (err) {
    console.error("Test script failed:", err);
  }
}

testLiveUpload();
