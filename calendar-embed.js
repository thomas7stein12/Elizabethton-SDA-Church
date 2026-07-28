const supabaseUrl = "https://wibusgniyyzvsbqknqlf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYnVzZ25peXl6dnNicWtucWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY1ODMsImV4cCI6MjA5Njc2MjU4M30.sWhho1HiltfWUMzq_GFDSgY6faftb2K24pCZmc2TpGk";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

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
  const { data, error } = await supabaseClient.from("events").select("*");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  events = {};

  (data || []).forEach((event) => {
    if (event.date) {
      if (!events[event.date]) {
        events[event.date] = [];
      }
      events[event.date].push(event);
    }

    if (event.repeat === "weekly") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);

        if (dateObj.getDay() === event.dayOfWeek) {
          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day,
          ).padStart(2, "0")}`;

          if (!events[dateString]) {
            events[dateString] = [];
          }

          events[dateString].push(event);
        }
      }
    }
  });

  renderCalendar();
  renderNextEvent();
}
function getNextEvent() {
  const all = [];

  for (const dateString in events) {
    for (const event of events[dateString]) {
      all.push({ ...event, dateString });
    }
  }

  all.sort((a, b) => {
    const [ay, am, ad] = a.dateString.split("-").map(Number);
    const [by, bm, bd] = b.dateString.split("-").map(Number);

    return new Date(ay, am - 1, ad) - new Date(by, bm - 1, bd);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return all.find((e) => {
    const [y, m, d] = e.dateString.split("-").map(Number);
    return new Date(y, m - 1, d) >= today;
  });
}

function renderNextEvent() {
  const event = getNextEvent();

  const title = document.getElementById("nextTitle");
  const date = document.getElementById("nextDate");
  const location = document.getElementById("nextLocation");

  if (!event) {
    title.textContent = "No gatherings";
    date.textContent = "";
    location.innerHTML = "";
    return;
  }

  title.textContent = event.title;

  const [year, month, day] = event.dateString.split("-").map(Number);
  const eventDate = new Date(year, month - 1, day);

  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const timeText = event.time ? ` • ${event.time}` : "";

  date.textContent = `${formattedDate}${timeText}`;

  location.innerHTML = `
    <i class="fas fa-location-dot"></i>
    ${event.location || "No location set"}
  `;
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDay = new Date(year, month, day);
    currentDay.setHours(0, 0, 0, 0);

    const isToday = currentDay.getTime() === today.getTime();

    let eventHTML = "";

    if (events[dateString]) {
      eventHTML = events[dateString]
        .map(
          (event) => `
    <div
      class="event"
      style="background:${colors[event.type] || "#666"}"
      title="${event.time || ""} | ${event.location || ""}"
      onclick='openEventModal(${JSON.stringify(event).replace(/"/g, "&quot;")})'
    >
      ${event.title}
    </div>
  `,
        )
        .join("");
    }

    calendar.innerHTML += `
    <div class="day ${isToday ? "today" : ""}">
      <div class="day_number">${day}</div>
      ${eventHTML}
    </div>
  `;
  }
}

// =====================
// NAVIGATION
// =====================
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

if (prevMonthBtn && nextMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadEvents();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadEvents();
  });
}

// =====================
// START APP
// =====================
window.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});

// EVENT MODAL

const eventModal = document.getElementById("eventModal");

const modalTitle = document.getElementById("modalEventTitle");
const modalDate = document.getElementById("modalEventDate");
const modalTime = document.getElementById("modalEventTime");
const modalLocation = document.getElementById("modalEventLocation");
const modalType = document.getElementById("modalEventType");

const closeEventModalBtn = document.getElementById("closeEventModal");

function openEventModal(event) {
  modalTitle.textContent = event.title || "Event";

if (event.date) {
  const [year, month, day] = event.date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  modalDate.textContent = localDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
} else {
  modalDate.textContent = "Weekly Event";
}

  modalTime.textContent = event.time ? `Time: ${event.time}` : "Time: Not set";
  modalLocation.textContent = `Location: ${event.location || "Not set"}`;
  modalType.textContent = `Type: ${event.type || "Not set"}`;

  eventModal.classList.add("show");
}

function closeEventModal() {
  eventModal.classList.remove("show");
}

if (closeEventModalBtn) {
  closeEventModalBtn.addEventListener("click", closeEventModal);
}

if (eventModal) {
  eventModal.addEventListener("click", (e) => {
    if (e.target === eventModal) {
      closeEventModal();
    }
  });
}
