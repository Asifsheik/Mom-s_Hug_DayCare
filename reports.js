// ============ DAILY REPORTS MODULE - YOUR TASKS ============
//
// 1. Mobile menu: when #menuBtn is clicked, toggle the "open" class on #nav.
//
// 2. Get the children: read the registered children (from localStorage or
//    your own sample array) and create one <option> per child inside
//    the dropdown #rChild. The option value is the child's id.
//
// 3. Default date: set #rDate and #rDay to today's date (YYYY-MM-DD).
//
// 4. Activity chips (#activityChips): create checkboxes for activities
//    such as "Art", "Music", "Outdoor play", "Story time", "Building blocks".
//    Each one is a label + checkbox + span, styled like the mood buttons.
//
// 5. Report form (#reportForm):
//    a. On submit, stop the page from reloading (preventDefault).
//    b. Check that a child, a date and a teacher name are chosen. If not,
//       show a message in #reportError and stop.
//    c. Collect the values: food (breakfast, lunch, snack), nap start and
//       end times, selected activities, mood, teacher and remarks.
//    d. If the same child already has a report for that date, replace it
//       instead of adding a second one.
//    e. Save the report and show it in #reportList.
//    f. Clear the form (the "Clear" button should do the same without saving).
//
// 6. Report list (#reportList): show each report for the day chosen in #rDay
//    as a card with class "report-card". Show the child's name, food eaten,
//    nap time, activities, mood and teacher remarks.
//
// 7. Heading: set #reportDayTitle to "Reports for 20 Nov 2026" (use the
//    date chosen in #rDay). Change it when the date changes.
//
// 8. Needs attention (#needsBox): show a red chip (class "need-chip") for any
//    child who had "none" for a meal, was "Unwell", or is marked "Fussy".
//    Example: "Ravi: Unwell". If nobody needs attention, show nothing.
//
// 9. Empty state: if there are no reports for the day, show "No reports yet
//    for this day" inside #reportList with the class "empty".
//
// 10. Bonus: save reports to localStorage so they stay after refresh.

