const checkbox = document.getElementById("hamburger-toggle");
const navMenu = document.getElementById("nav-menu");

checkbox.addEventListener("change", () => {
  navMenu.classList.toggle("open");
});
