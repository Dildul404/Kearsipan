// fetch 
function fetching(link) {
  fetch(link)
    .then(response => response.text())
    .then(data => {
      document.getElementById("contentContainer").innerHTML = data;

      // Pasang listener setelah konten baru masuk
      // mengambil surat dari json

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

        // Tunggu semua surat selesai dimuat
        await Promise.all(promises);
      }


      // template surat

      surat();

      async function surat() {

        await dataJson();

        const pembungkusSurat = document.getElementById("pembungkusSurat");
        const sectionDua = document.getElementById("dua");
        let path;

        document.querySelectorAll(".templateItem").forEach(surat => {
          surat.addEventListener("click", e => {
            e.preventDefault();
            sectionDua.classList.remove("hidden");

            path = surat.getAttribute("file");
            fetch(`./surat-surat/${path}`)
            .then(res => res.text())
            .then(data => {
              pembungkusSurat.innerHTML = data;
            })
          });
        });

        // memasukkan surat ke halaman edit
        const editBtn = document.getElementById("BtnEdit");
        const editSurat = document.getElementById("contentContainer");
        if (editBtn) {
            editBtn.addEventListener("click", async () => {

              // muat halaman edit
              const editRes = await fetch("edit.html");
              const editHtml = await editRes.text();

              editSurat.innerHTML = "";
              editSurat.innerHTML += editHtml;

              // baru setelah itu, muat surat
              const suratRes = await fetch(`surat-surat/${path}`);
              const suratHtml = await suratRes.text();
              document.getElementById("pembungkusSurat").innerHTML = suratHtml;
            });
          }

        // Batal btn
        const batalBtn = document.getElementById("BtnBatal");

        if(batalBtn) {
          if(sectionDua) {
            batalBtn.addEventListener("click", ()=> {
              sectionDua.classList.add("hidden");
            });
          }
        }
          
      }

    }); 
}

// berpindah halaman (halaman utama)
let url
document.querySelectorAll(".linkMainView").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    url = link.getAttribute('href');
    fetching(url);
  });
});