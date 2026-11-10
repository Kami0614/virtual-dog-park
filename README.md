# Virtual Dog Park

A dog encyclopedia and virtual pet website built for a first-year programming lab (AIE1101).
It is built with plain HTML, CSS and vanilla JavaScript - no frameworks, no backend, no
external APIs and no package manager.

## Features

- **Dog Encyclopedia** - Beagle, Golden Retriever and Poodle, each with a simple local
  illustration and short notes about size, personality and everyday care.
- **Adopt a dog** - choose one of the three breeds and give it a name (1-20 characters,
  spaces inside the name are allowed; empty names are rejected).
- **Feed and Play** - each click adds +10 happiness, up to a maximum of 100.
- **Next Day** - moves time forward: +1 day and -5 happiness (never below 0).
- **Growth stages** - Day 1 a Puppy, Days 2-3 a Young Dog, Day 4 onward an Adult Dog
  (the lab manual's default rule). The picture changes with the stage: the puppy face
  for the first three days, the adult face from Day 4, and the picture also grows
  larger at each stage.
- **Happiness bar** - the bar under the happiness score always mirrors the number:
  100/100 means a completely full bar, 0 means empty.
- **Saved progress** - the dog is restored after a page refresh, on the same browser
  and device.
- **Start Over** - asks for confirmation first; Cancel keeps the dog, Confirm deletes
  the saved progress and returns to the adoption form.

## How to preview

The page needs a small local server (this also makes browser storage behave normally):

1. Open the `virtual-dog-park` folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey (Extensions panel).
3. Right-click `index.html` and choose **Open with Live Server**.
4. A local address such as `http://127.0.0.1:5500` opens in your browser.

Keep using the same browser and the same local address, or the saved dog will not be found.

## Growth and happiness rules

| Action      | Effect                                        |
| ----------- | --------------------------------------------- |
| Adopt       | Day 1, Puppy stage, happiness 50              |
| Feed / Play | happiness +10, maximum 100                    |
| Next Day    | day +1, happiness -5, minimum 0               |
| Growth      | Day 1 Puppy - Days 2-3 Young Dog - Day 4+ Adult Dog |

## Where progress is stored

The adopted dog (name, breed, day, happiness) is saved under the storage key
`virtualDogParkPetV1` in your browser's **localStorage**. This is local to one browser on
one device - it is not an online account, and it is never uploaded to GitHub or anywhere
else. Clearing the browser's site data also clears the dog.

## Manual testing checklist

Try these in the browser and trust what you see:

- [ ] Three breed cards display with three illustrations and no broken images.
- [ ] Adopting with an empty (or spaces-only) name shows a helpful message.
- [ ] A name of exactly 20 characters works; the input stops at 20.
- [ ] A name containing `<` and `>` is displayed as plain text, safely.
- [ ] Feed and Play raise happiness by 10 and stop at 100.
- [ ] Next Day lowers happiness by 5, never below 0.
- [ ] The happiness bar width always matches the happiness score.
- [ ] Day 1 shows "Puppy"; Day 2 shows "Young Dog"; Day 4 shows "Adult Dog"
      with the grown-up picture.
- [ ] After a refresh the same dog comes back with its latest day and happiness.
- [ ] Start Over asks for confirmation; Cancel keeps the dog, Confirm clears it, and
      the old dog does not return after a refresh.
- [ ] On a narrow window the cards stack and nothing scrolls sideways.

## About the images

The SVG files in `assets/` are simple illustrations created for this project -
they are drawings, not photographs of real dogs. Each breed has a puppy drawing
(used on Days 1-3) and an adult drawing (used from Day 4 onward), so the dog
visibly grows up as the days pass.
