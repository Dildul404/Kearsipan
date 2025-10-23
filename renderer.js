// fetch 
function fetching(link) {
    fetch(link)
    .then(response => response.text())
    .then(data => {
        document.getElementById("contentContainer").innerHTML = data;
    });
}

// main View 
// fetching("mainView.html");

// change content with a tag
let url
document.querySelectorAll("#linkMainView").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    url = link.getAttribute('href');
    fetching(url);
    // return url;
  });
});
