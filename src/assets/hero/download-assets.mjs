import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const assets = [
  { url: 'http://localhost:3845/assets/ff435f2997ad8e459cfc6d4107023f43ae3ad992.svg', name: 'icon-live-mode.svg' },
  { url: 'http://localhost:3845/assets/19222bff179f422600d8566ed5bfba807cadf283.svg', name: 'icon-whatsapp-bubble.svg' },
  { url: 'http://localhost:3845/assets/69d41db7d16672ef184ad6de82961f9e126b4377.svg', name: 'badge-no-coding.svg' },
  { url: 'http://localhost:3845/assets/471b44de6a0c658fd5ffa2ed5e6c9770c5c0407e.svg', name: 'badge-whatsapp.svg' },
  { url: 'http://localhost:3845/assets/99c93d9e7cbe97714f33366f42b5c531b3d25ef3.svg', name: 'badge-qr-stand.svg' },
  { url: 'http://localhost:3845/assets/d29ec6b0950fc1d0c356a688bda0034e71ff28c8.svg', name: 'badge-responsive.svg' },
  { url: 'http://localhost:3845/assets/e2a5f9d9f3017ebc38e8f0dd049938ee7fc04a6e.svg', name: 'arrow-next.svg' },
  { url: 'http://localhost:3845/assets/62a1757441959ef465de517f190a74d8ca61354f.svg', name: 'arrow-next-2.svg' },
  { url: 'http://localhost:3845/assets/f2aa149bf9a3c22d833675abd6644faef698b540.svg', name: 'star-sparkle.svg' },
  { url: 'http://localhost:3845/assets/c6501d61a330bcde3017762699c433210faaeb4c.svg', name: 'cloud-mask.svg' },
  { url: 'http://localhost:3845/assets/8991761ace2df27a23b35ed11df96dc6a8fd94c7.svg', name: 'wave-vector5.svg' },
  { url: 'http://localhost:3845/assets/efd0471ca6f18114ffd2d5b6d8d76a2c4b4082c3.svg', name: 'wave-vector6.svg' },
  { url: 'http://localhost:3845/assets/07a38a9fefa6d626e49b52cae789ee7bf181d0f9.svg', name: 'ellipse-10.svg' },
  { url: 'http://localhost:3845/assets/7bec8a358d068d4a507e34c43e6e979f0a8d6a9e.svg', name: 'ellipse-13.svg' },
  { url: 'http://localhost:3845/assets/ecbd519094d5da6b682678eb3d8213f5bfe973a4.svg', name: 'ellipse-11.svg' },
  { url: 'http://localhost:3845/assets/6e90234b7d4f7312914f882ad692d967ff8c4e58.svg', name: 'cloud-vector10.svg' },
  { url: 'http://localhost:3845/assets/23ec0546773cb6bf47bf465c92d93385d3888d40.svg', name: 'cloud-vector8.svg' },
];

let done = 0;
let failed = 0;
for (const a of assets) {
  const filePath = path.join(__dirname, a.name);
  try {
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
      http.get(a.url, res => {
        if (res.statusCode !== 200) {
          console.log(`FAIL ${a.name} status=${res.statusCode}`);
          failed++;
          resolve();
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          done++;
          console.log(`OK ${a.name}`);
          resolve();
        });
      }).on('error', err => {
        console.log(`ERR ${a.name}: ${err.message}`);
        failed++;
        resolve();
      });
    });
  } catch (e) {
    console.log(`ERR ${a.name}: ${e.message}`);
    failed++;
  }
}
console.log(`\nDone: ${done} downloaded, ${failed} failed`);

