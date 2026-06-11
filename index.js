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