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

