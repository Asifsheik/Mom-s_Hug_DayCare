// ============ ATTENDANCE MODULE ============

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

// Turn a timestamp into a readable time like "09:15 AM"
function formatTime(timestamp) {
  if (!timestamp) {
    return "-";
  }
  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Work out minutes between two timestamps
function minutesBetween(start, end) {
  return Math.round((end - start) / 60000);
}

// ---------- 3. Load data ----------
let children = [];
const savedChildren = localStorage.getItem("children");
if (savedChildren !== null) {
  children = JSON.parse(savedChildren);
}

// attendance looks like: { "2026-11-20": { childId: { status, checkIn, checkOut } } }
let attendance = {};
const savedAttendance = localStorage.getItem("attendance");
if (savedAttendance !== null) {
  attendance = JSON.parse(savedAttendance);
}

function saveAttendance() {
  localStorage.setItem("attendance", JSON.stringify(attendance));
}

// Make sure a day exists in the attendance object
function getDayRecords(dateKey) {
  if (!attendance[dateKey]) {
    attendance[dateKey] = {};
  }
  return attendance[dateKey];
}

const todayKey = getDateKey();

// ---------- 4. Today's list ----------
function renderToday() {
  const list = document.getElementById("attList");
  list.innerHTML = "";

  const todayRecords = getDayRecords(todayKey);

  if (children.length === 0) {
    list.innerHTML = '<p class="empty">No children registered yet. Add some in the Children page.</p>';
    updateSummary();
    return;
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const record = todayRecords[child.id] || {};
    const status = record.status || "";

    // Build the row
    const row = document.createElement("div");
    row.className = "att-row";

    // Info part: name and status text
    let statusText = "Not marked";
    if (status === "in") {
      statusText = "In at " + formatTime(record.checkIn);
    } else if (status === "picked") {
      statusText = "In " + formatTime(record.checkIn) + " · Out " + formatTime(record.checkOut);
    } else if (status === "absent") {
      statusText = "Absent today";
    }

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = "<strong>" + child.first + " " + child.last + "</strong><br><small>" + statusText + "</small>";

    // Buttons part
    const buttons = document.createElement("div");
    buttons.className = "att-buttons";

    const inBtn = makeButton("Check in", "in", function () {
      markCheckIn(child.id);
    });
    const outBtn = makeButton("Check out", "out", function () {
      markCheckOut(child.id);
    });
    const absentBtn = makeButton("Absent", "absent", function () {
      markAbsent(child.id);
    });

    buttons.appendChild(inBtn);
    buttons.appendChild(outBtn);
    buttons.appendChild(absentBtn);

    row.appendChild(info);
    row.appendChild(buttons);
    list.appendChild(row);
  }

  updateSummary();
}

// Helper: create a button with a label, a class, and a click action
function makeButton(label, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}

// ---------- 5. Button actions ----------
function markCheckIn(childId) {
  const records = getDayRecords(todayKey);
  records[childId] = { status: "in", checkIn: Date.now(), checkOut: null };
  saveAttendance();
  renderToday();
}

function markCheckOut(childId) {
  const records = getDayRecords(todayKey);
  const record = records[childId] || {};

  // Can only check out if the child is in
  if (record.status !== "in") {
    alert("This child is not checked in yet.");
    return;
  }

  record.status = "picked";
  record.checkOut = Date.now();
  records[childId] = record;
  saveAttendance();
  renderToday();
}

function markAbsent(childId) {
  const records = getDayRecords(todayKey);
  records[childId] = { status: "absent", checkIn: null, checkOut: null };
  saveAttendance();
  renderToday();
}

// ---------- 6. Summary panel ----------
function updateSummary() {
  const records = getDayRecords(todayKey);

  let inCentre = 0;
  let picked = 0;
  let absent = 0;

  for (let i = 0; i < children.length; i++) {
    const record = records[children[i].id];
    if (!record) {
      continue;
    }
    if (record.status === "in") {
      inCentre++;
    } else if (record.status === "picked") {
      picked++;
    } else if (record.status === "absent") {
      absent++;
    }
  }

  const notMarked = children.length - inCentre - picked - absent;

  document.getElementById("sCentre").textContent = inCentre;
  document.getElementById("sPicked").textContent = picked;
  document.getElementById("sAbsent").textContent = absent;
  document.getElementById("sNot").textContent = notMarked;
  document.getElementById("sPresent").textContent = inCentre + picked;
  document.getElementById("sTotal").textContent = children.length;
}

// ---------- 7. Tabs (Today / History) ----------
const tabs = document.querySelectorAll(".tab");
const todayPanel = document.getElementById("tab-today");
const historyPanel = document.getElementById("tab-history");

for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function () {
    for (let j = 0; j < tabs.length; j++) {
      tabs[j].classList.remove("active");
    }
    this.classList.add("active");

    if (this.getAttribute("data-tab") === "history") {
      todayPanel.hidden = true;
      historyPanel.hidden = false;
      renderHistory();
    } else {
      historyPanel.hidden = true;
      todayPanel.hidden = false;
    }
  });
}

// ---------- 8. Last 7 days table ----------
function renderHistory() {
  const table = document.getElementById("historyTable");
  table.innerHTML = "";

  // Header row: "Child" followed by the last 7 dates
  let headerHtml = "<tr><th>Child</th>";
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(getDateKey(d));
    headerHtml += "<th>" + d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + "</th>";
  }
  headerHtml += "</tr>";

  // One row per child
  let bodyHtml = "";
  for (let i = 0; i < children.length; i++) {
    bodyHtml += "<tr><td>" + children[i].first + "</td>";
    for (let j = 0; j < dates.length; j++) {
      const records = attendance[dates[j]] || {};
      const record = records[children[i].id];
      let dot = '<span class="dot ring"></span>';
      if (record && (record.status === "in" || record.status === "picked")) {
        dot = '<span class="dot green"></span>';
      } else if (record && record.status === "absent") {
        dot = '<span class="dot red"></span>';
      }
      bodyHtml += '<td class="cell">' + dot + "</td>";
    }
    bodyHtml += "</tr>";
  }

  table.innerHTML = "<thead>" + headerHtml + "</thead><tbody>" + bodyHtml + "</tbody>";
}

// ---------- 9. Day details ----------
const histDate = document.getElementById("histDate");
histDate.value = todayKey;

function renderDayDetails() {
  const dateKey = histDate.value;
  const records = attendance[dateKey] || {};
  const body = document.getElementById("dayBody");
  body.innerHTML = "";

  let presentCount = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const record = records[child.id] || {};
    const status = record.status || "Not marked";

    if (record.status === "in" || record.status === "picked") {
      presentCount++;
    }

    // Time at centre only makes sense when both times exist
    let timeAtCentre = "-";
    if (record.checkIn && record.checkOut) {
      timeAtCentre = minutesBetween(record.checkIn, record.checkOut) + " min";
    }

    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + child.first + " " + child.last + "</td>" +
      "<td>" + status + "</td>" +
      "<td>" + formatTime(record.checkIn) + "</td>" +
      "<td>" + formatTime(record.checkOut) + "</td>" +
      "<td>" + timeAtCentre + "</td>";
    body.appendChild(row);
  }

  document.getElementById("daySummary").textContent =
    presentCount + " of " + children.length + " present on " + dateKey;
}

histDate.addEventListener("change", renderDayDetails);

// ---------- 10. Start the page ----------
renderToday();
renderDayDetails();

//done
