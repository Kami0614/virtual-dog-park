/* ---------------------------------------------------------
   Virtual Dog Park - JavaScript
   Round 1: fills in the year in the footer.
   Round 2: adopt one dog, then Feed and Play with it.
   --------------------------------------------------------- */

// --- Round 1: a small page detail ---
var yearBox = document.getElementById("year");

if (yearBox) {
  yearBox.textContent = new Date().getFullYear();
}

/* =========================================================
   Round 2: adoption and care
   ========================================================= */

// Everything we need to know about each breed, in one place.
var BREEDS = {
  "beagle": {
    label: "Beagle",
    image: "assets/beagle.svg",
    alt: "Illustration of a Beagle."
  },
  "golden-retriever": {
    label: "Golden Retriever",
    image: "assets/golden-retriever.svg",
    alt: "Illustration of a Golden Retriever."
  },
  "poodle": {
    label: "Poodle",
    image: "assets/poodle.svg",
    alt: "Illustration of a Poodle."
  }
};

// The adopted dog. null means "no dog yet".
var pet = null;

// A short helper so we do not repeat document.getElementById everywhere.
function find(id) {
  return document.getElementById(id);
}

// Create the dog, hide the form and show the dog card.
function adoptDog(name, breedKey) {
  pet = {
    name: name,
    breed: breedKey,
    day: 1,
    happiness: 50
  };

  find("adopt-form").hidden = true;
  find("dog-panel").hidden = false;
  showPet();
}

// Feed and Play both call this. The score can never go above 100.
function changeHappiness(amount) {
  if (!pet) {
    return;
  }

  pet.happiness = Math.min(100, pet.happiness + amount);
  showPet();
}

// Copy the current pet values into the page.
function showPet() {
  var breed = BREEDS[pet.breed];
  var photo = find("dog-photo");

  photo.src = breed.image;
  photo.alt = breed.alt;

  // textContent keeps a name like "<Buddy>" as plain text, never as HTML.
  find("dog-title-line").textContent = pet.name + " the " + breed.label;
  find("dog-day").textContent = pet.day;
  find("dog-stage").textContent = "Puppy";
  find("dog-happiness").textContent = pet.happiness;
}

// --- the Adopt button (a form submit) ---
find("adopt-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var nameBox = find("dog-name");
  var message = find("form-message");
  var name = nameBox.value.trim(); // trim() removes spaces at both ends

  if (name === "") {
    message.textContent = "Please type a name before adopting.";
    nameBox.focus();
    return;
  }

  if (name.length > 20) {
    message.textContent = "A dog name can have 20 characters at most.";
    nameBox.focus();
    return;
  }

  message.textContent = "";
  adoptDog(name, find("breed-choice").value);
  nameBox.value = "";
});

// --- Feed and Play ---
find("feed-button").addEventListener("click", function () {
  changeHappiness(10);
});

find("play-button").addEventListener("click", function () {
  changeHappiness(10);
});
