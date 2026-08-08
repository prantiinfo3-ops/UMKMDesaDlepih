/* =========================================================
   UMKM DESA DLEPIH — main.js
   Semua logic interaktif: nav mobile, slider foto, filter
   katalog, pencarian, dan render halaman detail.
   Data UMKM diambil dari js/data.js (variabel UMKM_DATA)
   ========================================================= */

/* ---------- Konfigurasi umum: GANTI SESUAI DATA ASLI ---------- */
const KONFIG = {
  namaDesa: "Dlepih",
  kecamatan: "Tirtomoyo",
  kabupaten: "Wonogiri",
  nomorWaAdmin: "6287765893536",      // nomor WA pengelola web / admin UMKM
  linkMapsDesa: "https://maps.app.goo.gl/2vrJtMWhgRKEaRxs6", // ganti dengan titik lokasi Balai Desa Dlepih

};

/* ---------- Utilitas ---------- */
function waLink(nomor, pesan){
  const teks = encodeURIComponent(pesan);
  return `https://wa.me/${nomor}?text=${teks}`;
}

function formatKategoriIcon(kategori){
  const map = {
    "Kuliner": "🍲",
    "Kerajinan": "🧺",
    "Hasil Bumi": "🌾",
    "Lainnya": "🏪"
  };
  return map[kategori] || "🏪";
}

function getParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- Nav mobile toggle ---------- */
function initNav(){
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if(toggle && links){
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
  // highlight active link
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window) || items.length === 0){
    items.forEach(el=>el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12});
  items.forEach(el=>io.observe(el));
}

/* ---------- Slider foto produk (dipakai di card & detail) ---------- */
function buildSlider(images, altBase){
  const wrap = document.createElement("div");
  wrap.className = "slider";
  wrap.style.background = "var(--tea)";

  const track = document.createElement("div");
  track.className = "slider-track";
  images.forEach((src, i)=>{
    // lapisan fallback: selalu ada di belakang, tampil kalau foto asli gagal dimuat
    const fallback = document.createElement("div");
    fallback.style.cssText = "position:relative;width:100%;height:100%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--tea);color:var(--olive-dark);font-weight:700;text-align:center;padding:16px;font-size:.95rem;";
    fallback.textContent = `${altBase} — foto ${i+1}`;

    const img = document.createElement("img");
    img.alt = `${altBase} - foto ${i+1}`;
    img.loading = "lazy";
    img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;";
    img.onerror = function(){ img.remove(); }; // gambar gagal → biarkan fallback warna+teks yang tampil
    img.src = src;

    fallback.appendChild(img);
    track.appendChild(fallback);
  });
  wrap.appendChild(track);

  if(images.length > 1){
    const prev = document.createElement("button");
    prev.className = "slider-nav prev"; prev.innerHTML = "&#10094;"; prev.type="button";
    prev.setAttribute("aria-label","Foto sebelumnya");
    const next = document.createElement("button");
    next.className = "slider-nav next"; next.innerHTML = "&#10095;"; next.type="button";
    next.setAttribute("aria-label","Foto berikutnya");

    const dots = document.createElement("div");
    dots.className = "slider-dots";
    images.forEach((_, i)=>{
      const d = document.createElement("button");
      d.type = "button";
      if(i===0) d.classList.add("active");
      d.setAttribute("aria-label", `Ke foto ${i+1}`);
      d.addEventListener("click", (ev)=>{ ev.stopPropagation(); goTo(i); });
      dots.appendChild(d);
    });

    let index = 0;
    function goTo(i){
      index = (i + images.length) % images.length;
      track.style.transform = `translateX(-${index*100}%)`;
      dots.querySelectorAll("button").forEach((d,di)=>d.classList.toggle("active", di===index));
    }
    prev.addEventListener("click", (ev)=>{ ev.stopPropagation(); goTo(index-1); });
    next.addEventListener("click", (ev)=>{ ev.stopPropagation(); goTo(index+1); });

    wrap.appendChild(prev);
    wrap.appendChild(next);
    wrap.appendChild(dots);

    // auto slide pelan-pelan
    let timer = setInterval(()=>goTo(index+1), 4500);
    wrap.addEventListener("mouseenter", ()=>clearInterval(timer));
    wrap.addEventListener("mouseleave", ()=>{ timer = setInterval(()=>goTo(index+1), 4500); });
  }
  return wrap;
}

/* ---------- Kartu produk ---------- */
function buatKartuProduk(item){
  const card = document.createElement("article");
  card.className = "produk-card reveal";

  const slider = buildSlider(item.gambar, item.nama);
  const badge = document.createElement("span");
  badge.className = "slider-badge";
  badge.textContent = item.kategori;
  slider.prepend(badge);
  card.appendChild(slider);

  const body = document.createElement("div");
  body.className = "produk-body";

  let uspHtml = item.usp ? `<span class="produk-usp">✦ ${item.usp}</span>` : "";

  body.innerHTML = `
    <h3>${item.nama}</h3>
    ${uspHtml}
    <p class="produk-desc">${item.deskripsi}</p>
    <div class="produk-meta">
      <span class="produk-price">${item.harga || "Hubungi penjual"}</span>
      <span>📍 ${item.dusun.split(",")[0]}</span>
    </div>
  `;

  const actions = document.createElement("div");
  actions.className = "produk-actions";
  actions.innerHTML = `<a class="btn btn-outline btn-sm" href="detail.html?id=${item.id}">Detail</a>`;
  if(item.telepon){
    actions.innerHTML += `<a class="btn btn-primary btn-sm" target="_blank" rel="noopener"
      href="${waLink(item.telepon, 'Halo, saya lihat produk ' + item.nama + ' di Web UMKM Desa Dlepih. Apakah masih tersedia?')}">WhatsApp</a>`;
  }
  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

/* ---------- Render grid produk unggulan (index.html) ---------- */
function renderUnggulan(containerId, jumlah=6){
  const el = document.getElementById(containerId);
  if(!el) return;
  const pilihan = UMKM_DATA.slice(0, jumlah);
  pilihan.forEach(item => el.appendChild(buatKartuProduk(item)));
}

/* ---------- Render halaman katalog dengan filter + search ---------- */
function initKatalog(){
  const grid = document.getElementById("katalog-grid");
  if(!grid) return;

  const chipGroup = document.getElementById("chip-group");
  const searchInput = document.getElementById("search-input");
  const emptyState = document.getElementById("empty-state");
  const countLabel = document.getElementById("hasil-count");

  const kategoriUnik = ["Semua", ...new Set(UMKM_DATA.map(i=>i.kategori))];
  let kategoriAktif = getParam("kategori") || "Semua";
  let kataKunci = "";

  kategoriUnik.forEach(kat=>{
    const chip = document.createElement("button");
    chip.className = "chip" + (kat===kategoriAktif ? " active" : "");
    chip.type = "button";
    chip.textContent = kat === "Semua" ? "Semua" : `${formatKategoriIcon(kat)} ${kat}`;
    chip.addEventListener("click", ()=>{
      kategoriAktif = kat;
      document.querySelectorAll("#chip-group .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      render();
    });
    chipGroup.appendChild(chip);
  });

  if(searchInput){
    searchInput.addEventListener("input", (e)=>{
      kataKunci = e.target.value.trim().toLowerCase();
      render();
    });
  }

  function render(){
    grid.innerHTML = "";
    const hasil = UMKM_DATA.filter(item=>{
      const cocokKategori = kategoriAktif === "Semua" || item.kategori === kategoriAktif;
      const cocokKata = !kataKunci ||
        item.nama.toLowerCase().includes(kataKunci) ||
        item.dusun.toLowerCase().includes(kataKunci) ||
        (item.deskripsi || "").toLowerCase().includes(kataKunci);
      return cocokKategori && cocokKata;
    });

    if(countLabel) countLabel.textContent = `${hasil.length} UMKM ditemukan`;

    if(hasil.length === 0){
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      hasil.forEach(item => grid.appendChild(buatKartuProduk(item)));
    }
    initReveal();
  }

  render();
}

/* ---------- Render halaman detail ---------- */
function initDetail(){
  const el = document.getElementById("detail-content");
  if(!el) return;

  const id = parseInt(getParam("id"), 10);
  const item = UMKM_DATA.find(i => i.id === id) || UMKM_DATA[0];

  document.title = `${item.nama} — UMKM Desa Dlepih`;

  const sliderHolder = document.getElementById("detail-slider-holder");
  sliderHolder.appendChild(buildSlider(item.gambar, item.nama));

  const uspBlock = item.usp ? `
    <div class="detail-usp">
      <b>Nilai Jual Unik</b>
      ${item.usp}
    </div>` : "";

  const teleponBlock = item.telepon ? `
    <div class="detail-fact">
      <span class="ic">📞</span>
      <div><b>Kontak</b>+${item.telepon}</div>
    </div>` : "";

  el.innerHTML = `
    <div class="detail-kategori">${formatKategoriIcon(item.kategori)} ${item.kategori}</div>
    <h1>${item.nama}</h1>
    <div class="detail-price">${item.harga || "Hubungi penjual"}</div>
    ${uspBlock}
    <p class="detail-desc">${item.deskripsi}</p>
    <div class="detail-facts">
      <div class="detail-fact">
        <span class="ic">📍</span>
        <div><b>Lokasi</b>${item.dusun}, Kec. ${KONFIG.kecamatan}, Kab. ${KONFIG.kabupaten}</div>
      </div>
      ${teleponBlock}
    </div>
    <div class="detail-actions">
      ${item.telepon ? `<a class="btn btn-primary btn-block" target="_blank" rel="noopener" href="${waLink(item.telepon, 'Halo, saya lihat produk ' + item.nama + ' di Web UMKM Desa Dlepih. Apakah masih tersedia?')}">
        💬 Chat via WhatsApp</a>` : `<button class="btn btn-primary btn-block" disabled>Nomor WA belum tersedia</button>`}
      ${item.maps ? `<a class="btn btn-olive btn-block" target="_blank" rel="noopener" href="${item.maps}">📍 Lihat Arah di Google Maps</a>` : ""}
      <a class="btn btn-outline btn-block" href="katalog.html">← Kembali ke Katalog</a>
    </div>
  `;

  // render produk lain / rekomendasi
  const lain = document.getElementById("produk-lain");
  if(lain){
    UMKM_DATA.filter(i=> i.kategori === item.kategori && i.id !== item.id)
      .slice(0,3)
      .forEach(i => lain.appendChild(buatKartuProduk(i)));
  }
  initReveal();
}

/* ---------- Render kartu Kabar Dlepih (kabar-dlepih.html) ---------- */
function buatKartuKabar(item){
  const card = document.createElement("article");
  card.className = "kabar-card reveal";

  card.innerHTML = `
    <div class="kabar-card-media">
      <img src="${item.gambar}" alt="${item.judul}" onerror="this.src='https://picsum.photos/seed/dlepih-${item.slug}/700/500'">
      <span class="kabar-badge">${item.badge}</span>
    </div>
    <div class="kabar-card-body">
      <h3>${item.judul}</h3>
      <p>${item.ringkasan}</p>
    </div>
  `;

  const actions = document.createElement("div");
  actions.className = "kabar-card-actions";
  actions.style.padding = "0 22px 22px";
  actions.innerHTML = `<a class="btn btn-outline btn-sm" href="kabar-detail.html?id=${item.id}">Lihat Detail</a>`;
  card.appendChild(actions);

  return card;
}

/* ---------- Render grid Kabar Dlepih dengan data-driven ---------- */
function initKabarGrid(){
  const grid = document.getElementById("kabar-grid");
  if(!grid) return;
  grid.innerHTML = "";
  KABAR_DATA.forEach(item => grid.appendChild(buatKartuKabar(item)));
  initReveal();
}

/* ---------- Render isi paragraf/list untuk halaman detail Kabar ---------- */
function renderIsiKabar(isiArray){
  return isiArray.map(blok => {
    if(blok.tipe === "p") return `<p>${blok.teks}</p>`;
    if(blok.tipe === "bold") return `<p><b>${blok.teks}</b></p>`;
    if(blok.tipe === "ul") return `<ul>${blok.items.map(i=>`<li>${i}</li>`).join("")}</ul>`;
    if(blok.tipe === "ol") return `<ol>${blok.items.map(i=>`<li>${i}</li>`).join("")}</ol>`;
    return "";
  }).join("");
}

/* ---------- Render halaman detail Kabar Dlepih ---------- */
function initKabarDetail(){
  const el = document.getElementById("kabar-detail-content");
  if(!el) return;

  const id = parseInt(getParam("id"), 10);
  const item = KABAR_DATA.find(i => i.id === id) || KABAR_DATA[0];

  document.title = `${item.judul} — Kabar Dlepih`;

  const gambarEl = document.getElementById("kabar-detail-gambar");
  if(gambarEl){
    gambarEl.src = item.gambar;
    gambarEl.alt = item.judul;
    gambarEl.onerror = function(){ this.src = `https://picsum.photos/seed/dlepih-${item.slug}/900/500`; };
  }

  // Kumpulkan tombol unduh: bisa 1 pdf tunggal, atau beberapa (pdfList)
  let tombolPdf = "";
  if(item.pdfList && item.pdfList.length){
    tombolPdf = item.pdfList.map(p => `<a class="btn btn-outline btn-sm" target="_blank" rel="noopener" href="${p.href}">${p.label}</a>`).join("");
  } else if(item.pdf){
    tombolPdf = `<a class="btn btn-outline btn-sm" target="_blank" rel="noopener" href="${item.pdf}">📄 Unduh Materi PDF</a>`;
  }
  const tombolApp = item.appUrl ? `<a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="${item.appUrl}">${item.appLabel || "🔗 Buka Aplikasi"}</a>` : "";

  el.innerHTML = `
    <span class="kabar-badge" style="position:static;display:inline-flex;margin-bottom:14px;">${item.badge}</span>
    <h1>${item.judul}</h1>
    <p class="detail-desc">${item.ringkasan}</p>
    <div class="kabar-detail-body">${renderIsiKabar(item.isi)}</div>
    <div class="kabar-card-actions" style="margin-top:22px;">
      ${tombolApp}
      ${tombolPdf}
      <a class="btn btn-olive btn-sm" href="kabar-dlepih.html">← Kembali ke Kabar Dlepih</a>
    </div>
  `;
  initReveal();
}

/* ---------- Isi statistik & footer link dinamis ---------- */
function initGlobalWidgets(){
  document.querySelectorAll("[data-total-umkm]").forEach(elm=> elm.textContent = UMKM_DATA.length);
  document.querySelectorAll("[data-total-kategori]").forEach(elm=> elm.textContent = new Set(UMKM_DATA.map(i=>i.kategori)).size);
  document.querySelectorAll("[data-wa-admin]").forEach(a=> a.href = waLink(KONFIG.nomorWaAdmin, "Halo, saya ingin bertanya seputar UMKM Desa Dlepih."));
  document.querySelectorAll("[data-maps-desa]").forEach(a=> a.href = KONFIG.linkMapsDesa);
  const y = document.getElementById("tahun-footer");
  if(y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", ()=>{
  initNav();
  initGlobalWidgets();
  renderUnggulan("produk-unggulan-grid", 6);
  initKatalog();
  initDetail();
  initKabarGrid();
  initKabarDetail();
  initReveal();
});
