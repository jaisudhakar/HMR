/* HMR Hotels & Resorts — rooms, gallery and guest reviews.
   Swap `img` paths for real photography when it is available (any .jpg/.webp works). */
window.HMR_HOTEL = {
  rooms: [
    {
      id: 'deluxe', name: 'Deluxe King Room', price: 320, size: 42, bed: 'King bed', guests: 2, view: 'City view',
      img: 'assets/img/hotel/deluxe-king.svg', tag: 'Most booked',
      desc: 'A calm retreat in deep green and copper, with floor-to-ceiling windows over the city lights.',
      features: ['Rain shower', 'Nespresso bar', 'Smart TV', 'Blackout blinds']
    },
    {
      id: 'terrace', name: 'Garden Terrace Room', price: 380, size: 48, bed: 'King bed', guests: 2, view: 'Private terrace',
      img: 'assets/img/hotel/terrace-room.svg', tag: 'Sunset views',
      desc: 'Glass doors open onto your own planted terrace, made for sunset aperitivo and slow breakfasts.',
      features: ['Private terrace', 'Outdoor loungers', 'Soaking tub', 'Pillow menu']
    },
    {
      id: 'executive', name: 'Executive Suite', price: 540, size: 68, bed: 'King bed + lounge', guests: 3, view: 'Skyline panorama',
      img: 'assets/img/hotel/executive-suite.svg', tag: 'Club lounge access',
      desc: 'A separate living room framed by a panoramic window, with club lounge access and evening canapés.',
      features: ['Club lounge', 'Living room', 'Walk-in wardrobe', 'Evening turndown']
    },
    {
      id: 'presidential', name: 'Presidential Suite', price: 2400, size: 180, bed: '2 bedrooms', guests: 4, view: 'Panoramic city view',
      img: 'assets/img/hotel/presidential-suite.svg', tag: 'Butler service',
      desc: 'Our signature residence: arched windows, a private dining room and a dedicated butler around the clock.',
      features: ['24-hour butler', 'Private dining', 'Airport transfer', 'Steam room']
    }
  ],

  gallery: [
    { img: 'assets/img/hotel/lobby.svg', cat: 'hotel', title: 'The Grand Lobby', wide: true },
    { img: 'assets/img/featured.webp', cat: 'dining', title: 'Ember — signature wagyu' },
    { img: 'assets/img/hotel/presidential-suite.svg', cat: 'rooms', title: 'Presidential Suite', tall: true },
    { img: 'assets/img/hotel/pool.svg', cat: 'wellness', title: 'Rooftop infinity pool' },
    { img: 'assets/img/hotel/deluxe-king.svg', cat: 'rooms', title: 'Deluxe King Room' },
    { img: 'assets/img/hotel/spa.svg', cat: 'wellness', title: 'The Copper Spa', wide: true },
    { img: 'assets/img/fondant.webp', cat: 'dining', title: 'Dark chocolate fondant' },
    { img: 'assets/img/hotel/terrace-room.svg', cat: 'rooms', title: 'Garden Terrace Room' },
    { img: 'assets/img/salmon.webp', cat: 'dining', title: 'Atlantic salmon' },
    { img: 'assets/img/hotel/executive-suite.svg', cat: 'rooms', title: 'Executive Suite', wide: true },
    { img: 'assets/img/hotel/fitness.svg', cat: 'wellness', title: 'Fitness studio' }
  ],

  reviews: [
    { quote: 'The most restful night I have had in years. Turndown, the pillow menu, a wagyu at midnight — every detail was considered.', name: 'Amelia R.', trip: 'Executive Suite · Business trip', rating: 5 },
    { quote: 'We celebrated our anniversary in the Garden Terrace Room. The team surprised us with a fondant and candles on the terrace.', name: 'Daniel & Priya', trip: 'Garden Terrace Room · Couple', rating: 5 },
    { quote: 'Impeccable service from check-in to check-out. The rooftop pool at sunset is worth the trip on its own.', name: 'Marco T.', trip: 'Deluxe King Room · Leisure', rating: 5 },
    { quote: 'Our butler remembered everything — the children’s favourite breakfast, our car times, even the newspaper. Truly a higher standard.', name: 'The Okafor family', trip: 'Presidential Suite · Family', rating: 5 },
    { quote: 'In-room dining arrived in twenty minutes, hot and beautifully plated. Better than most restaurants I have visited.', name: 'Sofia L.', trip: 'Deluxe King Room · Solo', rating: 4 }
  ]
};
