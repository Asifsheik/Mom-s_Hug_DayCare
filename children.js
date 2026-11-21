// ============ CHILDREN MODULE - YOUR TASKS ============
//
// 1. Mobile menu: when #menuBtn is clicked, toggle the "open" class on #nav.

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", function () {
  nav.classList.toggle("open");
});

//
// 2. Storage: create an array called "children" to hold registered children.
//    Each child is an object, e.g. { first, last, dob, gender, parent,
//    mobile, email, emergency, allergy, group }.
//
// 3. Register form (#childForm):
//    a. On submit, stop the page from reloading (preventDefault).
//    b. Read first name, last name, date of birth, mobile from the form.
//    c. If any required field is empty, show a message in #childError
//       and stop.
//    d. Check the mobile number is 10 digits. If not, show an error.
//    e. Work out the group from the date of birth:
//         under 2 years   -> "infants"
//         2 to 3 years    -> "toddlers"
//         3 years and up  -> "preschool"
//    f. Add the child to the array, clear the form and show the list.
//
// 4. Show the list (#childList): for each child, create a card with the
//    child's name, age, parent and mobile. Use the child-card class and
//    add "toddler" or "preschool" class for the colour border.
//
// 5. Count: put the number of children in #childCount, e.g. "(5)".
//
// 6. Empty state: if there are no children, show "No children registered yet"
//    inside #childList with the class "empty".
//
// 7. Search (#childSearch): as the user types, show only children whose
//    name or parent name contains the typed text (ignore upper/lower case).
//
// 8. Filters (#childFilters): when a chip is clicked, make it active and
//    show only children in that group. "All" shows everyone.
//
// 9. Bonus: save the array to localStorage so children stay after refresh.

