// ============ ATTENDANCE MODULE - YOUR TASKS ============
//
// 1. Mobile menu: when #menuBtn is clicked, toggle the "open" class on #nav.
//
// 2. Get the children: read the list of registered children (from the
//    children module's localStorage, or your own sample array).
//
// 3. Attendance storage: create an object to store each day's records, e.g.
//    { "2026-11-20": { childId: { status, checkIn, checkOut } } }
//    status can be "in", "picked", "absent" or missing (not marked).
//
// 4. Today list (#attList): for each child, create a row (class "att-row")
//    with the name and a small info line, plus buttons inside
//    class "att-buttons":
//      - "Check in"  (class "in")      -> status "in", save check-in time
//      - "Check out" (class "out")     -> status "picked", save check-out time
//      - "Absent"    (class "absent")  -> status "absent"
//    After each click, update the row and the summary.
//
// 5. Times: use new Date() to save the time as HH:MM for check in and out.
//
// 6. Summary (aside card): update these elements:
//      #sCentre   -> children currently in the centre (checked in, not out)
//      #sPicked   -> children picked up
//      #sAbsent   -> children marked absent
//      #sNot      -> children not marked yet
//      #sPresent  -> children present (in + picked)
//      #sTotal    -> total number of children
//
// 7. History tab: when the "History" tab button is clicked, hide #tab-today,
//    show #tab-history and make the button active. Do the reverse for Today.
//
// 8. Last 7 days table (#historyTable): build a table where the first column
//    is the child's name and the other columns are the last 7 dates. Each
//    cell shows a green dot (present), red dot (absent) or ring (not marked).
//
// 9. Day details: when a date is chosen in #histDate, fill #dayBody with one
//    row per child: name, status, check in, check out, and time at centre.
//    Show a short summary in #daySummary, e.g. "9 of 12 present".
//
// 10. Bonus: save attendance to localStorage so it stays after refresh.

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mainNav = document.querySelector("[data-main-nav]");
 
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      mainNav.classList.toggle("is-open", !isOpen);
      mainNav.classList.toggle("open", !isOpen);
    });
 
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        mainNav.classList.remove("is-open");
        mainNav.classList.remove("open");
      });
    });
  }
 
  const attendancePage = document.querySelector("#attList");
  if (attendancePage) {
    const children = [
      { id: "child-1", name: "Ava Morgan" },
      { id: "child-2", name: "Noah Bennett" },
      { id: "child-3", name: "Mia Carter" },
      { id: "child-4", name: "Leo Brooks" },
      { id: "child-5", name: "Ivy Parker" },
      { id: "child-6", name: "Ethan Reed" },
      { id: "child-7", name: "Zoe Collins" },
      { id: "child-8", name: "Lucas Hayes" },
      { id: "child-9", name: "Ella Foster" },
      { id: "child-10", name: "Oliver Ward" },
      { id: "child-11", name: "Grace Price" },
      { id: "child-12", name: "Jack Rivera" }
    ];
    const storageKey = "nostra-attendance";
    const notice = document.querySelector("#attendanceNotice");
    const todayTab = document.querySelector("#todayTab");
    const historyTab = document.querySelector("#historyTab");
    const todayPanel = document.querySelector("#tab-today");
    const historyPanel = document.querySelector("#tab-history");
    const dateInput = document.querySelector("#histDate");
    const attendanceDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const today = attendanceDate(new Date());
    let records = {};
 
    try {
      const savedRecords = localStorage.getItem(storageKey);
      if (savedRecords) {
        const parsedRecords = JSON.parse(savedRecords);
        if (parsedRecords && typeof parsedRecords === "object" && !Array.isArray(parsedRecords)) {
          records = parsedRecords;
        } else {
          throw new Error("Saved attendance data has an invalid format.");
        }
      }
    } catch (error) {
      notice.textContent = "Saved attendance could not be loaded. New changes may not include previous records.";
      console.error("Unable to load attendance from localStorage.", error);
    }
 
    const selectedDay = (date) => records[date] && typeof records[date] === "object" ? records[date] : {};
    const setNotice = (message) => {
      notice.textContent = message;
    };
    const saveRecords = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(records));
        setNotice("");
      } catch (error) {
        setNotice("Attendance changed on this device but could not be saved.");
        console.error("Unable to save attendance to localStorage.", error);
      }
    };
    const formatDate = (dateString, options) => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day).toLocaleDateString(undefined, options);
    };
    const makeElement = (tagName, className, text) => {
      const element = document.createElement(tagName);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    };
    const getStatus = (entry) => entry && ["in", "picked", "absent"].includes(entry.status) ? entry.status : "";
    const statusLabel = (status) => ({ in: "In the centre", picked: "Picked up", absent: "Absent" }[status] || "Not marked");
    const currentTime = () => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    };
 
    const updateSummary = () => {
      const dayRecords = selectedDay(today);
      const counts = { in: 0, picked: 0, absent: 0, not: 0 };
      children.forEach((child) => {
        const status = getStatus(dayRecords[child.id]);
        if (status) counts[status] += 1;
        else counts.not += 1;
      });
      document.querySelector("#sCentre").textContent = counts.in;
      document.querySelector("#sPicked").textContent = counts.picked;
      document.querySelector("#sAbsent").textContent = counts.absent;
      document.querySelector("#sNot").textContent = counts.not;
      document.querySelector("#sPresent").textContent = counts.in + counts.picked;
      document.querySelector("#sTotal").textContent = children.length;
    };
 
    const renderToday = () => {
      const dayRecords = selectedDay(today);
      const list = document.querySelector("#attList");
      list.replaceChildren();
      document.querySelector("#todayLabel").textContent = formatDate(today, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
 
      children.forEach((child) => {
        const entry = dayRecords[child.id] || {};
        const status = getStatus(entry);
        const row = makeElement("article", "att-row");
        const childInfo = makeElement("div", "att-child");
        childInfo.append(makeElement("h3", "", child.name));
        const info = [statusLabel(status)];
        if (entry.checkIn) info.push(`In ${entry.checkIn}`);
        if (entry.checkOut) info.push(`Out ${entry.checkOut}`);
        childInfo.append(makeElement("p", "att-info", info.join(" · ")));
 
        const buttons = makeElement("div", "att-buttons");
        [
          { label: "Check in", className: "in", status: "in" },
          { label: "Check out", className: "out", status: "picked" },
          { label: "Absent", className: "absent", status: "absent" }
        ].forEach((action) => {
          const button = makeElement("button", action.className, action.label);
          button.type = "button";
          button.setAttribute("aria-pressed", String(status === action.status));
          button.addEventListener("click", () => {
            const updatedEntry = { ...selectedDay(today)[child.id], status: action.status };
            if (action.status === "in") updatedEntry.checkIn = currentTime();
            if (action.status === "picked") updatedEntry.checkOut = currentTime();
            if (!records[today]) records[today] = {};
            records[today][child.id] = updatedEntry;
            saveRecords();
            renderToday();
            updateSummary();
            renderHistory();
            renderDayDetails(dateInput.value || today);
          });
          buttons.append(button);
        });
        row.append(childInfo, buttons);
        list.append(row);
      });
      updateSummary();
    };
 
    const renderHistory = () => {
      const table = document.querySelector("#historyTable");
      const dates = [];
      const current = new Date();
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date(current.getFullYear(), current.getMonth(), current.getDate() - offset);
        dates.push(attendanceDate(date));
      }
 
      const head = makeElement("thead");
      const headerRow = makeElement("tr");
      headerRow.append(makeElement("th", "", "Child"));
      dates.forEach((date) => {
        const heading = makeElement("th", "", formatDate(date, { weekday: "short", month: "numeric", day: "numeric" }));
        heading.scope = "col";
        headerRow.append(heading);
      });
      head.append(headerRow);
      const body = makeElement("tbody");
      children.forEach((child) => {
        const row = makeElement("tr");
        const name = makeElement("th", "", child.name);
        name.scope = "row";
        row.append(name);
        dates.forEach((date) => {
          const status = getStatus(selectedDay(date)[child.id]);
          const cell = makeElement("td");
          const dot = makeElement("span", `history-dot ${status === "absent" ? "absent" : status ? "present" : "unmarked"}`);
          dot.setAttribute("role", "img");
          dot.setAttribute("aria-label", statusLabel(status));
          cell.append(dot);
          row.append(cell);
        });
        body.append(row);
      });
      table.replaceChildren(head, body);
    };
 
    const formatDuration = (checkIn, checkOut) => {
      if (!checkIn) return "—";
      const [inHours, inMinutes] = checkIn.split(":").map(Number);
      let endHours;
      let endMinutes;
      if (checkOut) {
        [endHours, endMinutes] = checkOut.split(":").map(Number);
      } else {
        const now = new Date();
        endHours = now.getHours();
        endMinutes = now.getMinutes();
      }
      const duration = Math.max(0, endHours * 60 + endMinutes - (inHours * 60 + inMinutes));
      return `${Math.floor(duration / 60)}h ${String(duration % 60).padStart(2, "0")}m`;
    };
    const renderDayDetails = (date) => {
      const dayRecords = selectedDay(date);
      const body = document.querySelector("#dayBody");
      let presentCount = 0;
      body.replaceChildren();
      children.forEach((child) => {
        const entry = dayRecords[child.id] || {};
        const status = getStatus(entry);
        if (status === "in" || status === "picked") presentCount += 1;
        const row = makeElement("tr");
        [child.name, statusLabel(status), entry.checkIn || "—", entry.checkOut || "—", formatDuration(entry.checkIn, entry.checkOut)].forEach((value) => {
          row.append(makeElement("td", "", value));
        });
        body.append(row);
      });
      document.querySelector("#daySummary").textContent = `${presentCount} of ${children.length} present on ${formatDate(date, { month: "long", day: "numeric", year: "numeric" })}.`;
    };
 
    const activateTab = (showHistory) => {
      todayPanel.hidden = showHistory;
      historyPanel.hidden = !showHistory;
      todayTab.classList.toggle("active", !showHistory);
      historyTab.classList.toggle("active", showHistory);
      todayTab.setAttribute("aria-selected", String(!showHistory));
      historyTab.setAttribute("aria-selected", String(showHistory));
    };
    todayTab.addEventListener("click", () => activateTab(false));
    historyTab.addEventListener("click", () => activateTab(true));
    dateInput.value = today;
    dateInput.max = today;
    dateInput.addEventListener("change", () => {
      if (dateInput.value) renderDayDetails(dateInput.value);
    });
 
    renderToday();
    renderHistory();
    renderDayDetails(today);
  }
 
  document.querySelectorAll("[data-dismiss-announcement]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("[data-announcement]")?.remove();
    });
  });
 
  const searchInput = document.querySelector("[data-product-search]");
  const filterGroup = document.querySelector("[data-filter-group]");
  const productGrid = document.querySelector("[data-product-grid]");
 
  if (searchInput && filterGroup && productGrid) {
    const products = Array.from(productGrid.querySelectorAll("[data-product]"));
    const filterButtons = Array.from(filterGroup.querySelectorAll("[data-filter]"));
    const sortSelect = document.querySelector("[data-product-sort]");
    const countLabel = document.querySelector("[data-product-count]");
    const emptyState = document.querySelector("[data-empty-state]");
    const clearButton = document.querySelector("[data-search-clear]");
    let activeCategory = "all";
 
    const updateProducts = () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      const visibleProducts = products.filter((product) => {
        const matchesCategory = activeCategory === "all" || product.dataset.category === activeCategory;
        const searchableText = `${product.dataset.name} ${product.dataset.category} ${product.textContent}`.toLocaleLowerCase();
        return matchesCategory && searchableText.includes(query);
      });
 
      const sortOrder = sortSelect ? sortSelect.value : "featured";
      visibleProducts.sort((first, second) => {
        if (sortOrder === "low-high") return Number(first.dataset.price) - Number(second.dataset.price);
        if (sortOrder === "high-low") return Number(second.dataset.price) - Number(first.dataset.price);
        if (sortOrder === "name") return first.dataset.name.localeCompare(second.dataset.name);
        return products.indexOf(first) - products.indexOf(second);
      });
 
      products.forEach((product) => {
        product.hidden = !visibleProducts.includes(product);
      });
      visibleProducts.forEach((product) => productGrid.append(product));
 
      if (countLabel) {
        countLabel.textContent = `Showing ${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;
      }
      if (emptyState) emptyState.hidden = visibleProducts.length !== 0;
      if (clearButton) clearButton.hidden = searchInput.value.length === 0;
    };
 
    filterGroup.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeCategory = button.dataset.filter;
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      updateProducts();
    });
 
    searchInput.addEventListener("input", updateProducts);
    sortSelect?.addEventListener("change", updateProducts);
    clearButton?.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      updateProducts();
    });
    document.querySelector("[data-reset-products]")?.addEventListener("click", () => {
      searchInput.value = "";
      activeCategory = "all";
      filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === "all";
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      if (sortSelect) sortSelect.value = "featured";
      updateProducts();
    });
 
    document.querySelectorAll("[data-category-link]").forEach((link) => {
      link.addEventListener("click", () => {
        sessionStorage.setItem("nostra-category", link.dataset.categoryLink);
      });
    });
 
    const requestedCategory = sessionStorage.getItem("nostra-category");
    if (requestedCategory && filterButtons.some((button) => button.dataset.filter === requestedCategory)) {
      sessionStorage.removeItem("nostra-category");
      const requestedButton = filterButtons.find((button) => button.dataset.filter === requestedCategory);
      requestedButton.click();
    } else {
      updateProducts();
    }
 
    productGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-to-bag]");
      if (!button) return;
      button.classList.add("added");
      button.innerHTML = 'Added to bag <span aria-hidden="true">✓</span>';
      button.setAttribute("aria-label", `${button.closest("[data-product]").dataset.name} added to bag`);
      window.setTimeout(() => {
        button.classList.remove("added");
        button.innerHTML = 'Add to bag <span aria-hidden="true">+</span>';
        button.removeAttribute("aria-label");
      }, 1600);
    });
  }
 
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector("[data-newsletter-feedback]");
      if (feedback) feedback.textContent = "Thanks for joining us. This demo form is not connected to a mailing list.";
      form.reset();
    });
  });
 
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = contactForm.querySelector("[data-contact-feedback]");
      if (feedback) {
        feedback.textContent = "Thanks — your message is ready. This demo form is not connected to an inbox.";
        feedback.classList.add("is-success");
      }
      contactForm.reset();
    });
  }
});