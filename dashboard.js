// ============ DASHBOARD MODULE ============

// ---------- 1. Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", function () {
  nav.classList.toggle("open");
});

// ---------- 2. Helper functions ----------

// Returns a date as "YYYY-MM-DD" (used as a key for attendance)
function getDateKey(date) {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Reads saved data from localStorage. Returns the fallback if nothing is saved.
function loadData(key, fallback) {
  const saved = localStorage.getItem(key);
  if (saved === null) {
    return fallback;
  }
  return JSON.parse(saved);
}

// ---------- 3. Load data ----------
const children = loadData("children", []);
const attendance = loadData("attendance", {});
const reports = loadData("reports", []);

const todayKey = getDateKey();
const todayAttendance = attendance[todayKey] || {};

// ---------- 4. Today's date label ----------
const todayText = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});
document.getElementById("todayLabel").textContent = todayText;

// ---------- 5. Count the stats ----------
const totalChildren = children.length;
let presentCount = 0;
let absentCount = 0;

// Loop through each child and check their status for today
for (let i = 0; i < children.length; i++) {
  const record = todayAttendance[children[i].id];

  if (record && (record.status === "in" || record.status === "picked")) {
    presentCount++;
  } else if (record && record.status === "absent") {
    absentCount++;
  }
}

const notMarkedCount = totalChildren - presentCount - absentCount;

// Count reports written today
let reportsToday = 0;
for (let i = 0; i < reports.length; i++) {
  if (reports[i].date === todayKey) {
    reportsToday++;
  }
}

document.getElementById("stTotal").textContent = totalChildren;
document.getElementById("stPresent").textContent = presentCount;
document.getElementById("stAbsent").textContent = absentCount;
document.getElementById("stNotMarked").textContent = notMarkedCount;
document.getElementById("stReports").textContent = reportsToday;

// ---------- 6. Attendance percentage ----------
let percent = 0;
if (totalChildren > 0) {
  percent = Math.round((presentCount / totalChildren) * 100);
}
document.getElementById("pctBadge").textContent = percent + "%";

// ---------- 7. Jump card small text ----------
document.getElementById("jumpChildren").textContent = totalChildren + " children";
document.getElementById("jumpAttendance").textContent = presentCount + " present today";
document.getElementById("jumpReports").textContent = reportsToday + " reports today";

// ---------- 8. Upcoming activities ----------
const activities = [
  "10:00 AM - Story time",
  "11:00 AM - Art and craft",
  "12:00 PM - Lunch",
  "02:00 PM - Afternoon nap",
  "04:00 PM - Outdoor play"
];

const scheduleList = document.getElementById("schedule");
for (let i = 0; i < activities.length; i++) {
  const li = document.createElement("li");
  li.textContent = activities[i];
  scheduleList.appendChild(li);
}

// ---------- 9. Weekly attendance chart ----------
const weekChart = document.getElementById("weekChart");

// Loop from 6 days ago up to today
for (let i = 6; i >= 0; i--) {
  const day = new Date();
  day.setDate(day.getDate() - i);

  const key = getDateKey(day);
  const dayRecords = attendance[key] || {};

  // Count how many children were present on this day
  let dayPresent = 0;
  for (let j = 0; j < children.length; j++) {
    const rec = dayRecords[children[j].id];
    if (rec && (rec.status === "in" || rec.status === "picked")) {
      dayPresent++;
    }
  }

  let dayPercent = 0;
  if (totalChildren > 0) {
    dayPercent = Math.round((dayPresent / totalChildren) * 100);
  }

  // Build one bar: a column with a coloured bar and a day label
  const column = document.createElement("div");
  column.style.flex = "1";
  column.style.textAlign = "center";

  const bar = document.createElement("div");
  bar.style.height = Math.max(dayPercent, 4) + "px";
  bar.style.background = "#2A9D8F";
  bar.style.borderRadius = "8px 8px 0 0";
  bar.title = dayPercent + "%";

  const label = document.createElement("small");
  label.textContent = day.toLocaleDateString("en-IN", { weekday: "short" });

  column.appendChild(bar);
  column.appendChild(label);
  weekChart.appendChild(column);
}
