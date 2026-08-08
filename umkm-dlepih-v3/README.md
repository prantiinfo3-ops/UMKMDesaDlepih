# 🌿 Web UMKM Desa Dlepih — Panduan Lengkap (Untuk Pemula)

Halo! Ini adalah website katalog UMKM Desa Dlepih, Kecamatan Tirtomoyo, Kabupaten Wonogiri.
Panduan ini ditulis step-by-step supaya kamu yang **baru pertama kali** bikin web bisa mengikutinya dengan mudah.

---

## 📁 1. Struktur Folder

```
WEB_UMKM_DLEPIH/
├── index.html          → Halaman utama (Beranda)
├── katalog.html         → Halaman daftar semua UMKM (filter & pencarian)
├── detail.html          → Halaman detail 1 UMKM (dibuka dari katalog)
├── profil.html          → Halaman profil Desa Dlepih
├── css/
│   └── style.css        → Semua tampilan/warna/layout web
├── js/
│   ├── data.js           → Semua DATA UMKM (nama, harga, foto, dll) — dari Excel kamu
│   └── main.js            → Semua LOGIC (slider foto, filter, tombol WA, dll)
├── images/
│   └── produk/
│       ├── ayu-roti/
│       │   ├── 1.jpg
│       │   ├── 2.jpg
│       │   └── 3.jpg
│       ├── tempe-kripik-bu-dwi/
│       │   └── ... (1.jpg, 2.jpg, 3.jpg)
│       └── ... (1 folder per UMKM, otomatis dibuatkan sesuai nama di Excel)
└── README.md            → File panduan ini
```

Setiap UMKM di Excel kamu sudah otomatis dibuatkan **1 folder foto sendiri** di dalam `images/produk/`,
dengan 3 file: `1.jpg`, `2.jpg`, `3.jpg`. Saat ini isinya masih **foto placeholder** (kotak warna + nama UMKM),
supaya slider foto sudah langsung jalan. Tugas kamu tinggal **mengganti isinya dengan foto asli** (lihat langkah 4).

---

## 🖥️ 2. Cara Membuka di VS Code

1. Buka **VS Code**.
2. Klik **File → Open Folder...**, lalu pilih folder `WEB_UMKM_DLEPIH`.
3. Install extension **"Live Server"** (oleh Ritwick Dey) dari tab Extensions (ikon kotak di kiri, `Ctrl+Shift+X`), ketik "Live Server", klik Install.
4. Klik kanan pada file `index.html` → pilih **"Open with Live Server"**.
5. Browser otomatis terbuka dan web kamu langsung tampil (biasanya di `http://127.0.0.1:5500`).

> 💡 Kenapa harus pakai Live Server, bukan dobel klik file HTML langsung?
> Karena beberapa fitur (seperti peta di halaman Profil) butuh dijalankan lewat "server lokal", bukan dibuka langsung dari file. Live Server membuat server lokal otomatis di komputer kamu.

---

## ✏️ 3. Mengganti Data UMKM (Nama, Harga, Deskripsi, dll)

Semua data UMKM ada di file **`js/data.js`**. Buka file itu di VS Code, kamu akan lihat format seperti ini:

```js
{
  "id": 3,
  "kategori": "Kuliner",
  "nama": "Ayu roti",
  "usp": "Menggunakan Telur bebek yang membuat adona tidak lengket saat dikunyah",
  "deskripsi": "Bolu nempel di langit mulut? No More! ...",
  "harga": "Mulai dari Rp 2000/pcs",
  "telepon": "6285896105513",
  "dusun": "Dusun Dlepih, Desa Dlepih",
  "maps": "https://maps.app.goo.gl/LhKGsmDJnoQhBJiL9",
  "slug": "ayu-roti",
  "gambar": [
    "images/produk/ayu-roti/1.jpg",
    "images/produk/ayu-roti/2.jpg",
    "images/produk/ayu-roti/3.jpg"
  ]
}
```

Kamu bisa edit langsung nilai di dalam tanda kutip `" "`, misalnya ganti harga atau deskripsi. **Jangan hapus tanda koma `,`** di akhir baris (kecuali baris terakhir sebelum `}`), supaya tidak error.

Kalau mau **menambah UMKM baru**: copy salah satu blok `{ ... }`, tempel di bawahnya, beri `id` baru (angka berikutnya), lalu isi datanya. Jangan lupa buat folder foto baru di `images/produk/nama-umkm-baru/` (ikuti langkah 4).

Nomor WA di field `"telepon"` ditulis **tanpa tanda `+` dan tanpa spasi**, diawali `62` (bukan `0`). Contoh: `6281234567890`.

---

## 📸 4. Mengganti Foto Produk (Slide Foto)

1. Buka folder `images/produk/`.
2. Cari folder sesuai nama UMKM, misalnya `images/produk/ayu-roti/`.
3. Di dalamnya ada 3 file: `1.jpg`, `2.jpg`, `3.jpg` (masih foto placeholder/contoh).
4. **Ganti (replace/timpa)** ketiga file itu dengan foto asli produk UMKM tersebut.
   - ⚠️ **Nama file harus tetap sama**: `1.jpg`, `2.jpg`, `3.jpg` (huruf kecil semua).
   - Kalau foto asli formatnya `.png`, ganti juga nama file di `js/data.js` bagian `"gambar"` menjadi `.png`.
5. Simpan, lalu refresh browser — foto baru otomatis tampil di slider (card produk & halaman detail otomatis geser bergantian).

Kamu tidak perlu menambah kode apapun untuk slider — slider foto **sudah otomatis jalan** untuk semua UMKM yang punya foto lebih dari 1.

---

## ⚙️ 5. Mengatur Nomor WhatsApp Admin & Link Google Maps Desa

Buka file **`js/main.js`**, cari bagian paling atas:

```js
const KONFIG = {
  namaDesa: "Dlepih",
  kecamatan: "Tirtomoyo",
  kabupaten: "Wonogiri",
  nomorWaAdmin: "6281234567890",      // ganti dengan nomor WA admin/pengelola web
  linkMapsDesa: "https://maps.app.goo.gl/nAVT95CTrVcqo7oz5", // ganti link Google Maps Balai Desa
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
};
```

Ganti `nomorWaAdmin` dan `linkMapsDesa` sesuai data desa kamu yang sebenarnya. Ini akan otomatis dipakai di semua tombol "Hubungi via WhatsApp" dan "Lihat di Google Maps" pada Beranda, Katalog, dan Profil.

---

## 🎨 6. Tentang Warna & Tampilan

Semua warna diambil dari palet yang kamu kirim:

| Nama Warna | Kode HEX | Dipakai untuk |
|---|---|---|
| Ivory Mist | `#FFFAE9` | Warna latar utama |
| Soft Peach | `#F2D9A4` | Latar section & tombol lembut |
| Tea Green | `#D2E5C5` | Aksen kategori & badge |
| Brown Red | `#A43032` | Warna utama (tombol, judul, harga) |
| Olive | `#828700` | Navbar & tombol kedua |

Kalau mau ubah warna, cukup edit di bagian paling atas file **`css/style.css`**, di dalam `:root { ... }`. Semua elemen web otomatis ikut berubah karena semua warna dipanggil dari situ.

---

## 🗺️ 7. Halaman yang Tersedia

| Halaman | Fungsi |
|---|---|
| **Beranda** (`index.html`) | Perkenalan desa, statistik jumlah UMKM, kategori, produk unggulan |
| **Katalog UMKM** (`katalog.html`) | Semua UMKM, bisa difilter per kategori & dicari nama/dusun |
| **Detail UMKM** (`detail.html?id=3`) | Detail 1 UMKM: foto slide, deskripsi, harga, tombol WA & Arah Maps |
| **Profil Desa** (`profil.html`) | Cerita tentang Desa Dlepih, Wisata Kahyangan, dan peta lokasi |

Setiap kartu UMKM di Beranda/Katalog otomatis punya tombol:
- **Detail** → membuka `detail.html?id=...` sesuai UMKM tersebut
- **WhatsApp** → langsung chat ke nomor UMKM tersebut (jika nomornya tersedia di data)

Di halaman Detail, tombol **"Lihat Arah di Google Maps"** akan langsung memakai link Maps dari data Excel kamu.

---

## 🚀 8. Cara Upload/Hosting ke Internet (Opsional)

Kalau sudah selesai edit dan siap online, cara termudah untuk pemula:

1. Buat akun gratis di [Netlify](https://www.netlify.com) atau [Vercel](https://vercel.com).
2. Pilih menu **"Deploy manually" / "Drag and drop"**.
3. Seret (drag) seluruh folder `WEB_UMKM_DLEPIH` ke halaman upload mereka.
4. Tunggu beberapa detik, web kamu langsung online dengan link gratis (contoh: `umkm-dlepih.netlify.app`).

Kalau ingin domain sendiri seperti contoh (`langensari06.site`), kamu perlu beli domain (mulai ±Rp150.000/tahun) di penyedia seperti Niagahoster/Rumahweb, lalu arahkan ke hosting Netlify/Vercel tadi.

---

## ✅ Checklist Sebelum Publish

- [ ] Semua foto produk sudah diganti dengan foto asli (bukan placeholder)
- [ ] Semua nomor telepon di `js/data.js` sudah benar dan aktif WhatsApp-nya
- [ ] Link Google Maps tiap UMKM sudah dicek (klik satu-satu, pastikan sesuai lokasi)
- [ ] Nomor WA admin & link Maps desa di `js/main.js` sudah diisi data sebenarnya
- [ ] Coba buka web di HP (biasanya lewat Live Server juga bisa diakses HP yang sejaringan WiFi)

Selamat mencoba! Kalau ada bagian yang error atau bingung, cek dulu tanda kutip `" "` dan koma `,` di file `js/data.js` — itu penyebab error paling umum untuk pemula. 🙌
