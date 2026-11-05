/* ---------------------------------------------------------
   Virtual Dog Park - JavaScript
   Round 1: fills in the year in the footer.
   Round 2: adopt one dog, then Feed and Play with it.
   Round 3: Next Day growth, saved progress, Start Over.
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

// Where the dog is saved between visits. Only ever ONE dog is stored.
var STORAGE_KEY = "virtualDogParkPetV1";

// A short helper so we do not repeat document.getElementById everywhere.
function find(id) {
  return document.getElementById(id);
}

/* The growth rule lives in ONE function, so Day 2 is always
   "Young Dog" and Day 4 onward is always "Adult Dog". */
function stageFor(day) {
  if (day <= 1) {
    return "Puppy";
  }

  if (day <= 3) {
    return "Young Dog";
  }

  return "Adult Dog";
}

/* ---------- saving (Round 3) ----------
   The dog is stored in the browser's localStorage, which lives on this
   computer inside this browser. It is not an online account. */

function savePet() {
  if (pet) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  }
}

function loadPet() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    var data = JSON.parse(raw);

    // A tiny safety check so a broken save cannot crash the page.
    if (!data || !BREEDS[data.breed] || typeof data.name !== "string" || data.name === "") {
      return null;
    }

    return {
      name: data.name,
      breed: data.breed,
      day: data.day,
      happiness: data.happiness
    };
  } catch (err) {
    return null;
  }
}

function clearPet() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ---------- adopting and caring ---------- */

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
  savePet();
  showPet();
}

// Feed and Play both call this. The score can never go above 100.
function changeHappiness(amount) {
  if (!pet) {
    return;
  }

  pet.happiness = Math.min(100, pet.happiness + amount);
  savePet();
  showPet();
}

// Next Day moves time forward: +1 day, -5 happiness, never below 0.
function nextDay() {
  if (!pet) {
    return;
  }

  pet.day = pet.day + 1;
  pet.happiness = Math.max(0, pet.happiness - 5);
  savePet();
  showPet();
}

// Start Over asks first. Cancel keeps the dog; Confirm deletes the save.
function startOver() {
  var really = confirm(
    "Start over? " + (pet ? pet.name : "Your dog") +
    " and all saved progress will be deleted."
  );

  if (!really) {
    return; // Cancel: keep the dog exactly as it was.
  }

  clearPet();
  pet = null;

  find("dog-panel").hidden = true;
  find("adopt-form").hidden = false;
  find("form-message").textContent = "";
  find("dog-name").focus();
}

// Copy the current pet values into the page.
function showPet() {
  var breed = BREEDS[pet.breed];
  var stage = stageFor(pet.day);
  var photo = find("dog-photo");
  var fill = find("growth-fill");
  var stageClass = "stage-" + stage.toLowerCase().replace(" ", "-");

  photo.src = breed.image;
  photo.alt = breed.alt;
  photo.className = "dog-photo " + stageClass;

  fill.className = "growth-fill " + stageClass;

  // textContent keeps a name like "<Buddy>" as plain text, never as HTML.
  find("dog-title-line").textContent = pet.name + " the " + breed.label;
  find("dog-day").textContent = pet.day;
  find("dog-stage").textContent = stage;
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

// --- Feed, Play, Next Day and Start Over ---
find("feed-button").addEventListener("click", function () {
  changeHappiness(10);
});

find("play-button").addEventListener("click", function () {
  changeHappiness(10);
});

find("next-day-button").addEventListener("click", function () {
  nextDay();
});

find("start-over-button").addEventListener("click", function () {
  startOver();
});

/* --- saved progress ---
   If this browser already has a dog, bring it back instead of
   showing the empty adoption form. */
var savedDog = loadPet();

if (savedDog) {
  pet = savedDog;
  find("adopt-form").hidden = true;
  find("dog-panel").hidden = false;
  showPet();
}
