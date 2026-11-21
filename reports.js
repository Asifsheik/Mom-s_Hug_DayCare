// ============ DAILY REPORTS MODULE ============

// ---------- 1. Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", function () {
  nav.classList.toggle("open");
});

// ---------- 2. Helper functions ----------

// Returns a date as "YYYY-MM-DD"
function getDateKey(date) {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Turn "YYYY-MM-DD" into a readable date like "20 Nov 2026"
function prettyDate(dateKey) {
  const parts = dateKey.split("-");
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Find a child's name from their id
function getChildName(childId) {
  for (let i = 0; i < children.length; i++) {
    if (children[i].id === childId) {
      return children[i].first + " " + children[i].last;
    }
  }
  return "Unknown child";
}

// ---------- 3. Load data ----------
let children = [];
const savedChildren = localStorage.getItem("children");
if (savedChildren !== null) {
  children = JSON.parse(savedChildren);
}

let reports = [];
const savedReports = localStorage.getItem("reports");
if (savedReports !== null) {
  reports = JSON.parse(savedReports);
}

function saveReports() {
  localStorage.setItem("reports", JSON.stringify(reports));
}

// ---------- 4. Fill the child dropdown ----------
const childSelect = document.getElementById("rChild");

for (let i = 0; i < children.length; i++) {
  const option = document.createElement("option");
  option.value = children[i].id;
  option.textContent = children[i].first + " " + children[i].last;
  childSelect.appendChild(option);
}

// ---------- 5. Default dates ----------
const todayKey = getDateKey();
document.getElementById("rDate").value = todayKey;
document.getElementById("rDay").value = todayKey;

// ---------- 6. Activity checkboxes ----------
const activityNames = ["Art", "Music", "Outdoor play", "Story time", "Building blocks"];
const activityBox = document.getElementById("activityChips");

for (let i = 0; i < activityNames.length; i++) {
  const label = document.createElement("label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "activities";
  checkbox.value = activityNames[i];

  const span = document.createElement("span");
  span.textContent = activityNames[i];

  label.appendChild(checkbox);
  label.appendChild(span);
  activityBox.appendChild(label);
}

// ---------- 7. Save a report ----------
const reportForm = document.getElementById("reportForm");

reportForm.addEventListener("submit", function (event) {
  // Stop the page from reloading
  event.preventDefault();

  const childId = childSelect.value;
  const date = document.getElementById("rDate").value;
  const teacher = reportForm.teacher.value.trim();

  // Check the required fields
  if (childId === "" || date === "" || teacher === "") {
    document.getElementById("reportError").textContent = "Please choose a child, a date and enter the teacher's name.";
    return;
  }
  document.getElementById("reportError").textContent = "";

  // Read the selected radio buttons (food, mood)
  const breakfast = reportForm.querySelector('input[name="breakfast"]:checked').value;
  const lunch = reportForm.querySelector('input[name="lunch"]:checked').value;
  const snack = reportForm.querySelector('input[name="snack"]:checked').value;
  const mood = reportForm.querySelector('input[name="mood"]:checked').value;

  // Read the checked activities into an array
  const activities = [];
  const checkedBoxes = reportForm.querySelectorAll('input[name="activities"]:checked');
  for (let i = 0; i < checkedBoxes.length; i++) {
    activities.push(checkedBoxes[i].value);
  }

  // Build the report object
  const report = {
    childId: childId,
    date: date,
    breakfast: breakfast,
    lunch: lunch,
    snack: snack,
    sleepFrom: reportForm.sleepFrom.value,
    sleepTo: reportForm.sleepTo.value,
    activities: activities,
    mood: mood,
    teacher: teacher,
    remarks: reportForm.remarks.value.trim()
  };

  // If a report already exists for this child on this date, replace it
  let replaced = false;
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].childId === childId && reports[i].date === date) {
      reports[i] = report;
      replaced = true;
      break;
    }
  }

  // Otherwise add it as a new report
  if (!replaced) {
    reports.push(report);
  }

  saveReports();
  showDay(document.getElementById("rDay").value);
  clearForm();
});

// ---------- 8. Clear button ----------
function clearForm() {
  reportForm.reset();
  document.getElementById("rDate").value = todayKey;
  document.getElementById("reportError").textContent = "";
}

document.getElementById("reportClear").addEventListener("click", clearForm);

// ---------- 9. Show reports for a day ----------
function showDay(dateKey) {
  // Update the heading
  document.getElementById("reportDayTitle").textContent = "Reports for " + prettyDate(dateKey);

  const list = document.getElementById("reportList");
  list.innerHTML = "";

  // Find this day's reports
  const dayReports = [];
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].date === dateKey) {
      dayReports.push(reports[i]);
    }
  }

  if (dayReports.length === 0) {
    list.innerHTML = '<p class="empty">No reports yet for this day</p>';
  }

  // Build a card for each report
  for (let i = 0; i < dayReports.length; i++) {
    const r = dayReports[i];

    // Turn the activities array into text
    let activityText = "None";
    if (r.activities.length > 0) {
      activityText = r.activities.join(", ");
    }

    // Nap text
    let napText = "No nap";
    if (r.sleepFrom && r.sleepTo) {
      napText = r.sleepFrom + " to " + r.sleepTo;
    }

    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML =
      "<h3>" + getChildName(r.childId) + " · " + r.mood + "</h3>" +
      "<p>Food: breakfast " + r.breakfast + ", lunch " + r.lunch + ", snack " + r.snack + "</p>" +
      "<p>Nap: " + napText + "</p>" +
      "<p>Activities: " + activityText + "</p>" +
      "<p>Teacher: " + r.teacher + (r.remarks ? " · " + r.remarks : "") + "</p>";

    list.appendChild(card);
  }

  showNeedsAttention(dateKey);
}

// ---------- 10. Needs attention chips ----------
function showNeedsAttention(dateKey) {
  const box = document.getElementById("needsBox");
  box.innerHTML = "";

  for (let i = 0; i < reports.length; i++) {
    const r = reports[i];
    if (r.date !== dateKey) {
      continue;
    }

    // Collect the reasons for this child
    const reasons = [];
    if (r.breakfast === "none" || r.lunch === "none" || r.snack === "none") {
      reasons.push("didn't eat");
    }
    if (r.mood === "Unwell") {
      reasons.push("unwell");
    }
    if (r.mood === "Fussy") {
      reasons.push("fussy");
    }

    if (reasons.length > 0) {
      const chip = document.createElement("span");
      chip.className = "need-chip";
      chip.textContent = getChildName(r.childId) + ": " + reasons.join(", ");
      box.appendChild(chip);
    }
  }
}

// Change the list when the "Show day" date changes
document.getElementById("rDay").addEventListener("change", function () {
  showDay(this.value);
});

// ---------- 11. Start the page ----------
showDay(todayKey);
