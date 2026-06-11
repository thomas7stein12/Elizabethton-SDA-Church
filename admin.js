const supabaseClient = window.supabase.createClient(
  "https://wibusgniyyzvsbqknqlf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYnVzZ25peXl6dnNicWtucWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY1ODMsImV4cCI6MjA5Njc2MjU4M30.sWhho1HiltfWUMzq_GFDSgY6faftb2K24pCZmc2TpGk"
);

async function addEvent() {
  const event = {
    title: document.getElementById("title").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    repeat: document.getElementById("repeatWeekly").checked ? "weekly" : null,
    dayOfWeek: parseInt(document.getElementById("dayOfWeek").value)
  };

  const { data, error } = await supabaseClient
    .from("events")
    .insert([event]);

  if (error) {
    console.error("Error adding event:", error);
    alert("Failed to add event");
    return;
  }

  alert("Event added successfully!");

  clearForm();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("location").value = "";
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addBtn").addEventListener("click", addEvent);
});