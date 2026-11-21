// ============ CHILDREN MODULE ============

// ---------- 1. Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", function () {
  nav.classList.toggle("open");
});

// ---------- 2. Storage ----------
// Load saved children from localStorage, or start with an empty array
let children = [];
const savedChildren = localStorage.getItem("children");
if (savedChildren !== null) {
  children = JSON.parse(savedChildren);
}

// Save the array back to localStorage
function saveChildren() {
  localStorage.setItem("children", JSON.stringify(children));
}

// ---------- 3. Helper functions ----------

// Work out the age in years from a date of birth string ("YYYY-MM-DD")
function getAgeInYears(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return (today - dob) / msPerYear;
}

// Decide which group a child belongs to, based on age
function getGroup(dobString) {
  const age = getAgeInYears(dobString);
  if (age < 2) {
    return "infants";
  } else if (age < 3) {
    return "toddlers";
  } else {
    return "preschool";
  }
}

// Show a message in the error box
function showError(message) {
  document.getElementById("childError").textContent = message;
}

// ---------- 4. Register form ----------
const childForm = document.getElementById("childForm");

childForm.addEventListener("submit", function (event) {
  // Stop the page from reloading
  event.preventDefault();

  // Read the values from the form
  const first = childForm.first.value.trim();
  const last = childForm.last.value.trim();
  const dob = childForm.dob.value;
  const parent = childForm.parent.value.trim();
  const mobile = childForm.mobile.value.trim();
  const email = childForm.email.value.trim();
  const emergency = childForm.emergency.value.trim();
  const allergy = childForm.allergy.value.trim();

  // Read the selected gender (radio buttons)
  const genderInput = childForm.querySelector('input[name="gender"]:checked');
  const gender = genderInput ? genderInput.value : "";

  // Check that required fields are filled
  if (first === "" || last === "" || dob === "" || parent === "" || mobile === "") {
    showError("Please fill in all the required fields.");
    return;
  }

  // Check the mobile number is exactly 10 digits
  if (mobile.length !== 10 || isNaN(mobile)) {
    showError("Mobile number must be 10 digits.");
    return;
  }

  // Create the child object
  const child = {
    id: Date.now().toString(),
    first: first,
    last: last,
    dob: dob,
    gender: gender,
    parent: parent,
    mobile: mobile,
    email: email,
    emergency: emergency,
    allergy: allergy,
    group: getGroup(dob)
  };

  // Add to the array, save, and refresh the screen
  children.push(child);
  saveChildren();

  showError("");
  childForm.reset();
  renderChildren();
});

// ---------- 5. Render the list ----------
let currentGroup = "all";
let searchText = "";

function renderChildren() {
  const listBox = document.getElementById("childList");
  listBox.innerHTML = "";

  // Update the count in the heading
  document.getElementById("childCount").textContent = "(" + children.length + ")";

  // Show a message if there are no children at all
  if (children.length === 0) {
    listBox.innerHTML = '<p class="empty">No children registered yet</p>';
    return;
  }

  let shownCount = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const fullName = child.first + " " + child.last;
    const parentName = child.parent;

    // Filter by group
    if (currentGroup !== "all" && child.group !== currentGroup) {
      continue;
    }

    // Filter by search text (ignore upper and lower case)
    const search = searchText.toLowerCase();
    const matchesName = fullName.toLowerCase().indexOf(search) !== -1;
    const matchesParent = parentName.toLowerCase().indexOf(search) !== -1;
    if (search !== "" && !matchesName && !matchesParent) {
      continue;
    }

    // Build the card
    const card = document.createElement("div");
    card.className = "child-card";
    if (child.group === "toddlers") {
      card.classList.add("toddler");
    } else if (child.group === "preschool") {
      card.classList.add("preschool");
    }

    const age = getAgeInYears(child.dob).toFixed(1);
    card.innerHTML =
      "<h3>" + fullName + "</h3>" +
      "<p>Age: " + age + " yrs · " + child.group + "</p>" +
      "<p>Parent: " + parentName + " · " + child.mobile + "</p>";

    listBox.appendChild(card);
    shownCount++;
  }

  // If the filter or search hid everything
  if (shownCount === 0) {
    listBox.innerHTML = '<p class="empty">No children match your search</p>';
  }
}

// ---------- 6. Search ----------
const searchBox = document.getElementById("childSearch");

searchBox.addEventListener("input", function () {
  searchText = searchBox.value;
  renderChildren();
});

// ---------- 7. Filter chips ----------
const chips = document.querySelectorAll("#childFilters .chip");

for (let i = 0; i < chips.length; i++) {
  chips[i].addEventListener("click", function () {
    // Remove "active" from all chips, then add it to the clicked one
    for (let j = 0; j < chips.length; j++) {
      chips[j].classList.remove("active");
    }
    this.classList.add("active");

    currentGroup = this.getAttribute("data-group");
    renderChildren();
  });
}

// ---------- 8. Show the list when the page opens ----------
renderChildren();
