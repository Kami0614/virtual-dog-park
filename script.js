/* ---------------------------------------------------------
   Virtual Dog Park - JavaScript
   Round 1 only fills in the year in the footer.
   The adopted-dog features are added in Round 2 and 3.
   --------------------------------------------------------- */

// Find the empty <span id="year"> and put the current year in it.
var yearBox = document.getElementById("year");

if (yearBox) {
  yearBox.textContent = new Date().getFullYear();
}
