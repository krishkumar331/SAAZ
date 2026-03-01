require('dotenv').config();
const fs = require('fs');
fs.writeFileSync('env.txt', 'KEY=' + process.env.CLOUDINARY_URL);
console.log('Done');
