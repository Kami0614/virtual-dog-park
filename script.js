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
// Each breed has three drawings: puppy, adult and senior.
var BREEDS = {
  "beagle": {
    label: "Beagle",
    images: {
      puppy: { src: "assets/beagle-puppy.svg", alt: "Illustration of a Beagle puppy." },
      adult: { src: "assets/beagle.svg", alt: "Illustration of an adult Beagle." },
      senior: { src: "assets/beagle-senior.svg", alt: "Illustration of a senior Beagle." }
    }
  },
  "golden-retriever": {
    label: "Golden Retriever",
    images: {
      puppy: { src: "assets/golden-retriever-puppy.svg", alt: "Illustration of a Golden Retriever puppy." },
      adult: { src: "assets/golden-retriever.svg", alt: "Illustration of an adult Golden Retriever." },
      senior: { src: "assets/golden-retriever-senior.svg", alt: "Illustration of a senior Golden Retriever." }
    }
  },
  "poodle": {
    label: "Poodle",
    images: {
      puppy: { src: "assets/poodle-puppy.svg", alt: "Illustration of a Poodle puppy." },
      adult: { src: "assets/poodle.svg", alt: "Illustration of an adult Poodle." },
      senior: { src: "assets/poodle-senior.svg", alt: "Illustration of a senior Poodle." }
    }
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

/* The life stages change every 15 days, so the dog visibly grows up:
   Day 1-14   -> Puppy      (small picture, young face)
   Day 15-29  -> Adult Dog  (bigger picture, grown-up face)
   Day 30+    -> Senior Dog (biggest picture, grey muzzle)      */
function stageFor(day) {
  if (day <= 14) {
    return { label: "Puppy", key: "puppy" };
  }

  if (day <= 29) {
    return { label: "Adult Dog", key: "adult" };
  }

  return { label: "Senior Dog", key: "senior" };
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
  var art = breed.images[stage.key];

  photo.src = art.src;
  photo.alt = art.alt;
  photo.className = "dog-photo stage-" + stage.key;

  // The bar under "Happiness" always mirrors the happiness score.
  fill.style.width = pet.happiness + "%";

  // textContent keeps a name like "<Buddy>" as plain text, never as HTML.
  find("dog-title-line").textContent = pet.name + " the " + breed.label;
  find("dog-day").textContent = pet.day;
  find("dog-stage").textContent = stage.label;
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
