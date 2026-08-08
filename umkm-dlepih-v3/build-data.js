// build-data.js
// Menggabungkan semua file di content/umkm/*.json dan content/kabar/*.json
// menjadi satu file js/data.js (UMKM_DATA + KABAR_DATA) yang dibaca situs.
//
// Jalankan manual: node build-data.js
// Di Netlify, ini bisa diset otomatis jalan tiap deploy lewat "Build command".
const fs = require('fs');
const path = require('path');

function bacaFolder(folder){
  const dir = path.join(__dirname, folder);
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => (a.id || 0) - (b.id || 0));
}

const umkm = bacaFolder('content/umkm');
const kabar = bacaFolder('content/kabar');

const output = `/* File ini digenerate otomatis oleh build-data.js dari folder content/.
   JANGAN edit file ini secara manual — perubahan akan hilang tiap kali di-build ulang.
   Untuk edit data, ubah file JSON di content/umkm/ atau content/kabar/,
   atau (setelah CMS aktif) edit lewat halaman /admin. */

const UMKM_DATA = ${JSON.stringify(umkm, null, 2)};

const KABAR_DATA = ${JSON.stringify(kabar, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'js/data.js'), output);
console.log(`✅ js/data.js digenerate ulang: ${umkm.length} UMKM, ${kabar.length} Kabar`);
