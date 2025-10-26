// =====================================
// Sistem Navigasi + Cache Halaman
// =====================================

const cachedPages = {}; // Cache halaman
let currentPage = "";   // Menyimpan halaman aktif sekarang

// Fungsi utama: memuat halaman
async function fetching(link) {
  const contentContainer = document.getElementById("contentContainer");

  // Jika halaman sudah ada di cache, tampilkan langsung
  if (cachedPages[link]) {
    contentContainer.innerHTML = cachedPages[link];
    initPage(link);
    currentPage = link;
    return;
  }

  // Kalau belum, ambil dari server
  try {
    const res = await fetch(link);
    const data = await res.text();

    contentContainer.innerHTML = data;
    initPage(link); // jalankan inisialisasi khusus

    // Simpan ke cache setelah halaman terpasang
    cachedPages[link] = contentContainer.innerHTML;
    currentPage = link;

  } catch (err) {
    console.error("Gagal memuat halaman:", err);
  }
}

// =====================================
// Inisialisasi per halaman
// =====================================

function initPage(url) {
  if (url.includes("home.html")) initHomePage();
  else if (url.includes("edit.html")) initEditPage();
  // Tambahkan halaman lain jika ada
}

// -------------------------------------
// HOME PAGE LOGIC
// -------------------------------------
function initHomePage() {
  console.log("✅ Home page aktif");

  // Ambil data dari JSON
  async function dataJson() {
    const res = await fetch("./json/surat.json");
    const list = await res.json();
    const templates = document.getElementById("kumpulanTemplate");

    // Jalankan semua fetch surat secara paralel
    const promises = list.map(async surat => {
      const file = surat.file;
      const foto = surat.foto;
      const id = surat.id;

      templates.innerHTML += `
        <div class="templateItem" id="temp${id}" file="${file}">
          <img src="${foto}" alt="" class="suratContainer">
        </div>
      `;

      const suratRes = await fetch(`./surat-surat/${file}`);
      const suratData = await suratRes.text();
      const item = document.getElementById(`temp${id}`);
      item.innerHTML += suratData;
    });

    await Promise.all(promises);
  }

  // Jalankan
  surat();

  async function surat() {
    await dataJson();

    const pembungkusSurat = document.getElementById("pembungkusSurat");
    const sectionDua = document.getElementById("dua");
    let path;

    // Klik template surat
    document.querySelectorAll(".templateItem").forEach(surat => {
      surat.addEventListener("click", e => {
        e.preventDefault();
        sectionDua.classList.remove("hidden");

        path = surat.getAttribute("file");
        fetch(`./surat-surat/${path}`)
          .then(res => res.text())
          .then(data => {
            pembungkusSurat.innerHTML = data;
          });
      });
    });

    // Tombol Edit
    const editBtn = document.getElementById("BtnEdit");
    if (editBtn) {
      editBtn.addEventListener("click", async () => {
        localStorage.setItem("lastSurat", path); // simpan path surat
        await fetching("edit.html"); // Pindah ke halaman edit
      });
    }

    // Tombol Batal
    const batalBtn = document.getElementById("BtnBatal");
    if (batalBtn && sectionDua) {
      batalBtn.addEventListener("click", () => {
        sectionDua.classList.add("hidden");
      });
    }
  }

  // 
}

// -------------------------------------
// EDIT PAGE LOGIC
// -------------------------------------
function initEditPage() {
  console.log("✏️ Edit page aktif");

  const pembungkusSurat = document.getElementById("pembungkusSurat");
  const path = localStorage.getItem("lastSurat");

  if (path && pembungkusSurat) {
    fetch(`surat-surat/${path}`)
      .then(res => res.text())
      .then(data => {
        pembungkusSurat.innerHTML = data;
      });
  }

  // Tombol kembali ke home
  const backBtn = document.getElementById("BtnBack");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      fetching("home.html");
    });
  }
}

// =====================================
// Navigasi antar halaman
// =====================================
document.querySelectorAll(".linkMainView").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const url = link.getAttribute('href');
    fetching(url);
  });
});
