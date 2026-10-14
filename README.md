# HMR Hotels & Resorts

A luxury hotel website for **HMR Hotels & Resorts**, home of the HMR dum biryani. Built with **Next.js 16 (App Router)**, React 19 and TypeScript.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production build
```

Deploys to Vercel as-is (import the repository; no settings needed).

## What's on the page

| Section | Highlights |
| --- | --- |
| **Header** | Top bar with phone, email and the book-direct offer; navigation that follows the section in view; room number picker; order button; **Book a stay** |
| **Opening screen** | Full-screen photo slideshow (signature biryani, rooftop pool, Presidential Suite, lobby) with slow zoom, progress bars, drifting embers and a headline that rises in |
| **Booking bar** | Check-in and check-out, guests and rooms, room type, **Check availability** |
| **The art of dum** | Biryani story with photography, a four-step timeline that draws itself, and one-click ordering for the Signature and Family handis |
| **In-room dining menu** | Biryani first, then mains, breakfast, salads, sides, desserts and drinks; live search (press `/`), category filters, list or grid view, featured dish you can drag to turn, dish details, order drawer with delivery times, and an order tracker |
| **Rooms & Suites** | Draggable carousel with size, bed, guests, view, features and nightly price, linked to a three-step booking flow |
| **Experiences** | Ember restaurant, infinity pool, spa, bar, fitness studio and concierge |
| **About, gallery, reviews, location** | Counting stats, awards, a filterable gallery with full-screen viewer, rotating guest reviews and travel times |

## Where things live

```
src/app/            layout, page and global styles
src/components/     one file per area (Header, Hero, Booking, Menu, Overlays, Hotel…)
src/data/menu.ts    dishes, prices and categories
src/data/hotel.ts   rooms, gallery and reviews
src/data/photos.ts  every photograph used on the site
public/img/food/    food photography from the original menu mockups
```

## Before going live

- **Photography.** Hotel and biryani photos are free-licence stock images from [Pexels](https://www.pexels.com/license/), loaded from the Pexels CDN as placeholders. Replace them with HMR's own photos by editing `src/data/photos.ts` (put files in `public/img/` and use paths like `/img/hotel/lobby.jpg`). If a photo ever fails to load, the site tries the next one listed, then shows a plain tile.
- **Content.** Phone, email, address, prices, room count, review scores, reviews and awards are sample content.
- **Ordering and booking** show confirmations in the browser but are not connected to a booking engine or kitchen system yet.
