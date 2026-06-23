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

// HERO

const slides = document.querySelectorAll(".hero_slide");
const dots = document.querySelectorAll(".hero_dot");

const nextBtn = document.querySelector(".hero_next");
const prevBtn = document.querySelector(".hero_prev");

let currentSlide = 0;

function showSlide(index) {

    slides.forEach(slide =>
        slide.classList.remove("active")
    );

    dots.forEach(dot =>
        dot.classList.remove("active")
    );

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
}

function nextSlide() {

    let next = currentSlide + 1;

    if (next >= slides.length) {
        next = 0;
    }

    showSlide(next);
}

function prevSlide() {

    let prev = currentSlide - 1;

    if (prev < 0) {
        prev = slides.length - 1;
    }

    showSlide(prev);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
    });
});

setInterval(nextSlide, 6000);

// CONTACT CARD \/

const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");

// OPEN
function openContact() {
  contactModal.classList.add("show");
}

// CLOSE
function closeContactModal() {
  contactModal.classList.remove("show");
}

// close button
if (closeContact) {
  closeContact.addEventListener("click", closeContactModal);
}

// click outside card closes it
if (contactModal) {
  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
  });
}