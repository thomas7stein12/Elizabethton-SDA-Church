const supabaseUrl = "https://wibusgniyyzvsbqknqlf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYnVzZ25peXl6dnNicWtucWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY1ODMsImV4cCI6MjA5Njc2MjU4M30.sWhho1HiltfWUMzq_GFDSgY6faftb2K24pCZmc2TpGk";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const supabase_gallery = window.supabase.createClient(
    "https://wibusgniyyzvsbqknqlf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYnVzZ25peXl6dnNicWtucWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY1ODMsImV4cCI6MjA5Njc2MjU4M30.sWhho1HiltfWUMzq_GFDSgY6faftb2K24pCZmc2TpGk"
);

// =====================
// MOBILE MENU
// =====================
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

async function loadGallery(){

    const { data, error } = await supabase_gallery
        .from("gallery")
        .select("*")
        .order("created_at",{ascending:false});

    if(error){
        console.error(error);
        return;
    }

    const gallery=document.getElementById("gallery");

    gallery.innerHTML="";

    data.forEach(photo => {

    gallery.innerHTML += `
        <div 
            class="gallery_card"
            onclick="openImageModal('${photo.img_url}', '${photo.caption || ""}')"
        >

            <img 
                src="${photo.img_url}" 
                alt="Church Photo"
            >

            <div class="gallery_caption">
                ${photo.caption || ""}
            </div>

        </div>
    `;

});

}

loadGallery();

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

// =========================
// IMAGE MODAL
// =========================

function openImageModal(imageUrl, caption) {

    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");

    modalImage.src = imageUrl;
    modalCaption.textContent = caption;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeImageModal() {

    const modal = document.getElementById("imageModal");

    modal.classList.remove("active");

    document.body.style.overflow = "";
}


// Close with X
document.getElementById("closeModal").addEventListener("click", closeImageModal);


// Close when clicking the dark background
document.getElementById("imageModal").addEventListener("click", function(event) {

    if (event.target === this) {
        closeImageModal();
    }

});


// Close with Escape key
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeImageModal();
    }

});