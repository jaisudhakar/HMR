# HMR Hotels & Resorts

An animated hotel website for **HMR Hotels & Resorts**, built around its in-room dining menu. It is a static site built with plain HTML, CSS and JavaScript, so there is no build step.

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
| **Top bar & header** | Phone, email, a "book direct" offer, five-link navigation and a **Book a stay** button |
| **Booking bar** | Check-in and check-out dates, a guests and rooms picker, room type and **Check availability** |
| **Booking flow** | Three steps: available rooms with nightly and total prices, guest details, then a confirmation code |
| **Rooms & Suites** | A draggable carousel of four rooms with size, bed, guests, view, features and a "from" price per night |
| **Experiences** | A tile grid for Ember restaurant, the infinity pool, spa, Copper Bar, fitness studio and concierge, plus a services row |
| **About & awards** | Stats that count up as you scroll to them, and award badges |
| **Gallery** | Filterable photo grid with a full-screen viewer (arrow keys and swipe) |
| **Guest reviews** | Overall rating, animated category bars and an auto-rotating review carousel |
| **Location** | Address, travel times, directions and call buttons, and an animated map |
| **Footer** | HMR Rewards sign-up, link columns, social icons and legal links |

The site also remembers the guest's room number, cart and preferred layout in `localStorage`. It works on phones (floating cart bar, bottom sheets, full-screen nav), supports keyboard use (`Esc` closes overlays) and respects `prefers-reduced-motion`.

## Placeholder content to replace

- **Hotel images** in `assets/img/hotel/` are illustrations, not photos. Put real photos in `assets/img/hotel/` and update the `img` paths in `js/hotel-data.js` and the `<img>` tags in the Experiences section of `index.html`.
- **Contact details**: the phone number, email addresses and the address "1 Harbour Boulevard, City Centre" are made up. The map is an illustration, and **Get directions** searches Google Maps for "HMR Hotels & Resorts".
- **Numbers**: the room count, prices, review scores, review count, reviews and awards are sample content.
- **Demo only**: bookings, food orders and the newsletter sign-up show confirmations in the browser but aren't sent anywhere.

## Editing the menu

Every dish lives in `js/menu-data.js`. Each one has a name, category, price, preparation time, description, dietary tags, an optional pairing and an optional photo. A dish without a photo shows an HMR monogram plate instead.

```
index.html
css/styles.css
js/menu-data.js   ← menu items and categories
js/hotel-data.js  ← rooms, gallery and reviews
js/app.js         ← menu, cart and animation
js/hotel.js       ← booking, rooms, gallery and reviews
assets/img/       ← dish photography (hotel/ holds the room and venue illustrations)
```
