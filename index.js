const menu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");

function openMenu() {
    menu.classList.add("menu_open");
    overlay.classList.add("overlay_open");
}

function closeMenu() {
    menu.classList.remove("menu_open");
    overlay.classList.remove("overlay_open");
}