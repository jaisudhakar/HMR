import { food, photos, type Photo } from './photos';

export type Room = {
  id: string; name: string; price: number; size: number; bed: string; guests: number; view: string;
  photo: Photo; tag: string; desc: string; features: string[];
};

export const rooms: Room[] = [
  {
    id: 'deluxe', name: 'Deluxe King Room', price: 320, size: 42, bed: 'King bed', guests: 2, view: 'City view',
    photo: photos.roomDeluxe, tag: 'Most booked',
    desc: 'A calm retreat in deep green and copper, with floor-to-ceiling windows over the city lights.',
    features: ['Rain shower', 'Nespresso bar', 'Smart TV', 'Blackout blinds'],
  },
  {
    id: 'terrace', name: 'Garden Terrace Room', price: 380, size: 48, bed: 'King bed', guests: 2, view: 'Private terrace',
    photo: photos.roomTerrace, tag: 'Sunset views',
    desc: 'Glass doors open onto your own planted terrace, made for sunset chai and slow breakfasts.',
    features: ['Private terrace', 'Outdoor loungers', 'Soaking tub', 'Pillow menu'],
  },
  {
    id: 'executive', name: 'Executive Suite', price: 540, size: 68, bed: 'King bed + lounge', guests: 3, view: 'Skyline panorama',
    photo: photos.roomExecutive, tag: 'Club lounge access',
    desc: 'A separate living room framed by a panoramic window, with club lounge access and evening canapés.',
    features: ['Club lounge', 'Living room', 'Walk-in wardrobe', 'Evening turndown'],
  },
  {
    id: 'presidential', name: 'Presidential Suite', price: 2400, size: 180, bed: '2 bedrooms', guests: 4, view: 'Panoramic city view',
    photo: photos.roomPresidential, tag: 'Butler service',
    desc: 'Our signature residence: chandeliers, a private dining room and a dedicated butler around the clock.',
    features: ['24-hour butler', 'Private dining', 'Airport transfer', 'Steam room'],
  },
];

export type GalleryItem = { photo: Photo; cat: 'rooms' | 'dining' | 'wellness' | 'hotel'; title: string; wide?: boolean; tall?: boolean };

export const gallery: GalleryItem[] = [
  { photo: photos.lobby, cat: 'hotel', title: 'The Grand Lobby', wide: true },
  { photo: photos.biryaniHandi, cat: 'dining', title: 'The HMR Signature Handi Biryani' },
  { photo: photos.roomPresidential, cat: 'rooms', title: 'Presidential Suite', tall: true },
  { photo: photos.pool, cat: 'wellness', title: 'Rooftop infinity pool' },
  { photo: photos.roomDeluxe, cat: 'rooms', title: 'Deluxe King Room' },
  { photo: photos.restaurant, cat: 'dining', title: 'Ember restaurant', wide: true },
  { photo: photos.spa, cat: 'wellness', title: 'The Copper Spa' },
  { photo: photos.biryaniPlate, cat: 'dining', title: 'Chicken dum biryani' },
  { photo: photos.exterior, cat: 'hotel', title: 'HMR by night' },
  { photo: photos.roomExecutive, cat: 'rooms', title: 'Executive Suite', wide: true },
  { photo: photos.bar, cat: 'dining', title: 'The Copper Bar' },
  { photo: photos.gym, cat: 'wellness', title: 'Fitness studio' },
  { photo: food('featured'), cat: 'dining', title: 'Wagyu striploin' },
];

export const reviews = [
  { quote: 'We came for the suite and stayed for the biryani. They opened the handi at our door — the saffron steam filled the room. Best biryani I have had outside Hyderabad.', name: 'Amelia R.', trip: 'Executive Suite · Business trip', rating: 5 },
  { quote: 'We celebrated our anniversary in the Garden Terrace Room. The team surprised us with a fondant and candles on the terrace.', name: 'Daniel & Priya', trip: 'Garden Terrace Room · Couple', rating: 5 },
  { quote: 'Impeccable service from check-in to check-out. The rooftop pool at sunset is worth the trip on its own.', name: 'Marco T.', trip: 'Deluxe King Room · Leisure', rating: 5 },
  { quote: 'Our butler remembered everything — the children’s favourite breakfast, our car times, even the newspaper. Truly a higher standard.', name: 'The Okafor family', trip: 'Presidential Suite · Family', rating: 5 },
  { quote: 'Ordered the family handi biryani for four at midnight. Arrived sealed and steaming in thirty minutes. My kids still talk about it.', name: 'Sofia L.', trip: 'Deluxe King Room · Family', rating: 5 },
];
