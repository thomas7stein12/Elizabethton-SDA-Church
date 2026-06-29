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
const dotsContainer = document.querySelector(".hero_dots");

let currentSlide = 0;

// Create a dot for every slide
slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("hero_dot");

    if (index === 0) {
        dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
        showSlide(index);
    });

    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".hero_dot");

function showSlide(index) {

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
}

function nextSlide() {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}

document.querySelector(".hero_next").addEventListener("click", nextSlide);
document.querySelector(".hero_prev").addEventListener("click", prevSlide);

let interval = setInterval(nextSlide, 6000);

document.querySelector(".hero").addEventListener("mouseenter", () => {
    clearInterval(interval);
});

document.querySelector(".hero").addEventListener("mouseleave", () => {
    interval = setInterval(nextSlide, 6000);
});

let startX = 0;

const hero = document.querySelector(".hero");

hero.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

hero.addEventListener("touchend", e => {

    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
        nextSlide();
    }

    if (endX - startX > 50) {
        prevSlide();
    }
});


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