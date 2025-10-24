// fetch 
function fetching(link) {
  fetch(link)
    .then(response => response.text())
    .then(data => {
      document.getElementById("contentContainer").innerHTML = data;

      // Pasang listener setelah konten baru masuk
      // memasukkan surat ke halaman edit
      const editBtn = document.getElementById("BtnEdit");
      if (editBtn) {
          editBtn.addEventListener("click", async () => {

            // muat halaman edit
            const editRes = await fetch("edit.html");
            const editHtml = await editRes.text();
            document.getElementById("contentContainer").innerHTML = editHtml;

            // baru setelah itu, muat surat
            const suratRes = await fetch("surat-surat/surat1.html");
            const suratHtml = await suratRes.text();
            document.getElementById("pembungkusSurat").innerHTML = suratHtml;
          });
        }

      // Batal btn
      const batalBtn = document.getElementById("BtnBatal");
      const sectionDua = document.getElementById("dua");

      if(batalBtn) {
        if(sectionDua) {
          batalBtn.addEventListener("click", (e)=> {
            sectionDua.classList.add("hidden");
          });
        }
      }

      // template surat
      let surat
      document.querySelectorAll("#templateItem").forEach(surat => {
        surat.addEventListener("click", e => {
          e.preventDefault();
          sectionDua.classList.remove("hidden");
        });
      });


    }); 
}

// berpindah halaman (halaman utama)
let url
document.querySelectorAll("#linkMainView").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    url = link.getAttribute('href');
    fetching(url);
  });
});