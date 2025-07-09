const form = document.getElementById("reminderForm");
const medName = document.getElementById("medName");
const medTime = document.getElementById("medTime");
const reminderList = document.getElementById("reminderList");
const visualAlert = document.getElementById("visualAlert");
const alarmSound = document.getElementById("alarmSound");
const emptyMsg = document.getElementById("emptyMsg");

let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

function displayReminders() {
  reminderList.innerHTML = "";
  if (reminders.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  // Sort reminders by time
  reminders.sort((a, b) => a.time.localeCompare(b.time));

  reminders.forEach((reminder, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${reminder.name} at ${reminder.time}
      <button class="delete-btn" onclick="deleteReminder(${index})">×</button>`;
    reminderList.appendChild(li);
  });
}

function deleteReminder(index) {
  reminders.splice(index, 1);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  displayReminders();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const reminder = {
    name: medName.value,
    time: medTime.value,
    notified: false
  };
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  medName.value = "";
  medTime.value = "";
  displayReminders();
});

function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

function checkReminders() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  let updated = false;

  reminders.forEach(reminder => {
    if (!reminder.notified && reminder.time === currentTime) {
      triggerAlert(reminder.name);
      reminder.notified = true;
      updated = true;
    }
  });

  if (updated) {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }
}

function triggerAlert(medName) {
  if (Notification.permission === "granted") {
    new Notification("💊 Medication Reminder", {
      body: `Time to take: ${medName}`,
      icon: "https://cdn-icons-png.flaticon.com/512/2947/2947994.png"
    });
  }

  visualAlert.textContent = `🔔 Time to take: ${medName}`;
  visualAlert.classList.add("show");
  setTimeout(() => {
    visualAlert.classList.remove("show");
  }, 15000);

  try {
    alarmSound.play();
  } catch (e) {
    console.warn("Sound failed:", e);
  }
}

displayReminders();
requestNotificationPermission();
setInterval(checkReminders, 10000);
