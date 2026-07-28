// =====================
// MOBILE MENU
// =====================
const menu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");

function openMenu() {
  if (!menu || !overlay) return;
  menu.classList.add("menu_open");
  overlay.classList.add("overlay_open");
}

function closeMenu() {
  if (!menu || !overlay) return;
  menu.classList.remove("menu_open");
  overlay.classList.remove("overlay_open");
}

if (overlay) {
  overlay.addEventListener("click", closeMenu);
}

document.querySelectorAll(".menu_link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const supabaseClient = window.supabase.createClient(
  "https://wibusgniyyzvsbqknqlf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYnVzZ25peXl6dnNicWtucWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY1ODMsImV4cCI6MjA5Njc2MjU4M30.sWhho1HiltfWUMzq_GFDSgY6faftb2K24pCZmc2TpGk",
);

const ADMIN_PASSWORD = "Disapp1844!";

function checkPassword() {
  const input = document.getElementById("passwordInput").value;

  if (input === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";

    location.reload();

    updateAuthUI();
  } else {
    document.getElementById("loginError").textContent = "Wrong password";
  }
}

// =====================
// GALLERY ADMIN
// =====================

async function uploadGalleryPhoto() {

  const fileInput = document.getElementById("galleryImage");
  const captionInput = document.getElementById("galleryCaption");
  const status = document.getElementById("galleryUploadStatus");

  const file = fileInput.files[0];
  const caption = captionInput.value.trim();

  if (!file) {
    alert("Please choose an image first.");
    return;
  }

  status.textContent = "Uploading...";

  // Create a unique filename
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  try {
    // Upload image to Supabase Storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      status.textContent = "Upload failed.";
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseClient
      .storage
      .from("gallery")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Save image information to database
    const { error: databaseError } = await supabaseClient
      .from("gallery")
      .insert([
        {
          img_url: imageUrl,
          caption: caption || null,
        },
      ]);

    if (databaseError) {
      console.error("Database error:", databaseError);

      // If database insert failed, remove uploaded file
      await supabaseClient
        .storage
        .from("gallery")
        .remove([fileName]);

      status.textContent = "Failed to save photo.";
      return;
    }

    status.textContent = "Photo uploaded successfully!";

    // Clear form
    fileInput.value = "";
    captionInput.value = "";

    // Reload gallery
    loadGalleryAdmin();

  } catch (error) {
    console.error(error);
    status.textContent = "Something went wrong.";
  }
}

async function loadGalleryAdmin() {

  const galleryList = document.getElementById("galleryAdminList");

  if (!galleryList) return;

  galleryList.innerHTML = "Loading photos...";

  const { data, error } = await supabaseClient
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gallery loading error:", error);
    galleryList.innerHTML = "Failed to load gallery.";
    return;
  }

  if (!data || data.length === 0) {
    galleryList.innerHTML = "<p>No photos uploaded yet.</p>";
    return;
  }

  galleryList.innerHTML = data.map(photo => `
    <div class="gallery_admin_item">

      <img
        src="${photo.img_url}"
        alt="${photo.caption || "Church Photo"}"
      >

      <div class="gallery_admin_info">
        <p>
          ${photo.caption || "No caption"}
        </p>

        <button onclick="deleteGalleryPhoto('${photo.id}', '${photo.img_url}')">
          Delete
        </button>
      </div>

    </div>
  `).join("");
}

async function deleteGalleryPhoto(id, imageUrl) {

  if (!confirm("Are you sure you want to delete this photo?")) {
    return;
  }

  try {

    // Get the filename from the public URL
    const storagePath = imageUrl.split("/storage/v1/object/public/gallery/")[1];

    // Delete from Storage
    if (storagePath) {
      const { error: storageError } = await supabaseClient
        .storage
        .from("gallery")
        .remove([decodeURIComponent(storagePath)]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }

    // Delete from database
    const { error: databaseError } = await supabaseClient
      .from("gallery")
      .delete()
      .eq("id", id);

    if (databaseError) {
      console.error("Database delete error:", databaseError);
      alert("Failed to delete photo.");
      return;
    }

    loadGalleryAdmin();

  } catch (error) {
    console.error(error);
    alert("Something went wrong while deleting the photo.");
  }
}

async function addEvent() {
  const event = {
    title: document.getElementById("title").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    repeat: document.getElementById("repeatWeekly").checked ? "weekly" : null,
    dayOfWeek: parseInt(document.getElementById("dayOfWeek").value),
  };

  const { data, error } = await supabaseClient.from("events").insert([event]);

  if (error) {
    console.error("Error adding event:", error);
    alert("Failed to add event");
    return;
  }

  alert("Event added successfully!");

  clearForm();
  loadEventList();
  refreshCalendarPreview();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("location").value = "";
}

function logout() {
  localStorage.removeItem("isAdmin");
  updateAuthUI();
  location.reload();
}

function updateAuthUI() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const adminStatus = document.getElementById("adminStatus");
  const mobileAdminStatus = document.getElementById("mobileAdminStatus");

  const logoutBtn = document.getElementById("logoutBtn");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

  if (adminStatus) adminStatus.classList.toggle("hidden", !isAdmin);
  if (mobileAdminStatus) mobileAdminStatus.classList.toggle("hidden", !isAdmin);

  if (logoutBtn) logoutBtn.classList.toggle("hidden", !isAdmin);
  if (mobileLogoutBtn) mobileLogoutBtn.classList.toggle("hidden", !isAdmin);
}

window.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (isAdmin) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";

    loadEventList();
    loadGalleryAdmin();
  }

  updateAuthUI();

  document.getElementById("addBtn").addEventListener("click", addEvent);

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", logout);
});

async function loadEventList() {
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .order("date");

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById("eventList");

  list.innerHTML = data
    .map(
      (event) => `
      <div class="event_item">
        <h3>${event.title}</h3>

        <p><strong>Date:</strong> ${event.date || "Weekly Event"}</p>
        <p><strong>Time:</strong> ${event.time || "Not set"}</p>
        <p><strong>Location:</strong> ${event.location || "Not set"}</p>
        <p><strong>Type:</strong> ${event.type}</p>

        <button onclick="deleteEvent('${event.id}')">
          Delete
        </button>
      </div>
    `,
    )
    .join("");
}
async function deleteEvent(id) {
  console.log("Deleting event", id);
  if (!confirm("Delete this event?")) {
    return;
  }

  const { error } = await supabaseClient.from("events").delete().eq("id", id);

  if (error) {
    alert("Failed to delete event");
    return;
  }

  loadEventList();
  refreshCalendarPreview();
}
function refreshCalendarPreview() {
  const frame = document.getElementById("calendarPreview");

  if (frame) {
    frame.src = frame.src;
  }
}

