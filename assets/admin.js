let events = JSON.parse(localStorage.getItem("churchEvents")) || [];

function saveEvents() {
  localStorage.setItem("churchEvents", JSON.stringify(events));
  renderList();
}

function addEvent() {

  const event = {
    id: Date.now(),
    title: document.getElementById("title").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    repeat: document.getElementById("repeatWeekly").checked ? "weekly" : null,
    dayOfWeek: parseInt(document.getElementById("dayOfWeek").value)
  };

  events.push(event);
  saveEvents();
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents();
}

function renderList() {

  const list = document.getElementById("eventList");
  list.innerHTML = "";

  events.forEach(event => {

    list.innerHTML += `
      <div class="event_item">
        <strong>${event.title}</strong><br>
        ${event.date || "Repeats Weekly"}<br>
        ${event.time} - ${event.location}

        <button onclick="deleteEvent(${event.id})">
          Delete
        </button>
      </div>
    `;
  });
}

renderList();