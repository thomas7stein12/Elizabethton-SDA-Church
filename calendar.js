const supabaseUrl = "https://wibusgniyyzvsbqknqlf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYnVzZ25peXl6dnNicWtucWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY1ODMsImV4cCI6MjA5Njc2MjU4M30.sWhho1HiltfWUMzq_GFDSgY6faftb2K24pCZmc2TpGk";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

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

// =====================
// CALENDAR ELEMENTS
// =====================
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

// Event colors
const colors = {
  worship: "#FDC20F",
  meeting: "#17593F",
  prayer: "#3465a4",
  fellowship: "#c27c0e",
  outreach: "#7b3fc9",
};

// =====================
// STATE
// =====================
let currentDate = new Date();
let events = {};

// =====================
// LOAD EVENTS FROM SUPABASE
// =====================
async function loadEvents() {
  const { data, error } = await supabaseClient
    .from("events")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  events = {};

  (data || []).forEach((event) => {

    // ONE-TIME EVENTS
    if (event.date) {
      if (!events[event.date]) {
        events[event.date] = [];
      }
      events[event.date].push(event);
    }

    // REPEATING WEEKLY EVENTS
    if (event.repeat === "weekly") {

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {

        const dateObj = new Date(year, month, day);

        if (dateObj.getDay() === event.dayOfWeek) {

          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          if (!events[dateString]) {
            events[dateString] = [];
          }

          events[dateString].push(event);
        }
      }
    }
  });

  renderCalendar();
}

// =====================
// RENDER CALENDAR
// =====================
function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += `<div class="day"></div>`;
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    let eventHTML = "";

    if (events[dateString]) {
      eventHTML = events[dateString]
        .map((event) => `
          <div
            class="event"
            style="background:${colors[event.type] || "#666"}"
            title="${event.time || ""} | ${event.location || ""}"
          >
            ${event.title}
          </div>
        `)
        .join("");
    }

    calendar.innerHTML += `
      <div class="day">
        <div class="day_number">${day}</div>
        ${eventHTML}
      </div>
    `;
  }
}

// =====================
// NAVIGATION
// =====================
document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  loadEvents();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  loadEvents();
});

// =====================
// START APP
// =====================
window.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});