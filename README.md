# HMR Hotels & Resorts — In-Room Dining

An animated in-room dining menu for **HMR Hotels & Resorts**. It is a static site built with plain HTML, CSS and JavaScript, so there is no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's inside

| Section | Highlights |
| --- | --- |
| **Hero**, "Dining, delivered to your door." | Branded preloader, headline that rises in line by line, floating plate with steam, drifting gold dust, mouse parallax, a 360° turn button and a counting delivery stat |
| **Category strip** | Breakfast, All-day, Dinner, Desserts, Wine & Bar. Each one jumps to the menu with that filter applied |
| **Our Menu** | Live search (press `/`), category chips with a sliding active pill, a list/grid toggle and staggered card animations |
| **Featured dish panel** | Hover or click a dish to preview it on a copper pedestal. Drag to tilt it in 3D, swipe further to go to the next dish, or pick from the thumbnails |
| **Dish detail sheet** | Photo, description, dietary badges, wine pairing, a quantity stepper and an add button |
| **Your Order drawer** | Images fly into the cart, quantity steppers and remove, delivery slots (ASAP or the next half hours), kitchen notes, an animated total, and charge to room or pay on delivery |
| **Order confirmation** | Animated check mark, an order number and a live tracker (Received → Preparing → On its way) |
| **Our Hotel / Contact** | Stats that count up as you scroll to them, plus service hours and extensions |

The site also remembers the guest's room number, cart and preferred layout in `localStorage`. It works on phones (floating cart bar, bottom sheets, full-screen nav), supports keyboard use (`Esc` closes overlays) and respects `prefers-reduced-motion`.

## Editing the menu

Every dish lives in `js/menu-data.js`. Each one has a name, category, price, preparation time, description, dietary tags, an optional pairing and an optional photo. A dish without a photo shows an HMR monogram plate instead.

```
index.html
css/styles.css
js/menu-data.js   ← menu items and categories
js/app.js         ← interactions and animation
assets/img/       ← dish photography
```
