// Script bantu: pecah js/data.js jadi file-file kecil di content/umkm dan content/kabar
const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('js/data.js', 'utf8');
content = content.replace('const UMKM_DATA', 'var UMKM_DATA').replace('const KABAR_DATA', 'var KABAR_DATA');
eval(content);

UMKM_DATA.forEach(item => {
  const filePath = path.join('content/umkm', `${item.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
});
console.log(`✅ ${UMKM_DATA.length} file UMKM dibuat di content/umkm/`);

KABAR_DATA.forEach(item => {
  const filePath = path.join('content/kabar', `${item.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
});
console.log(`✅ ${KABAR_DATA.length} file Kabar dibuat di content/kabar/`);
