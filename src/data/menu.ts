import { food, photos, type Photo } from './photos';

export type Diet = 'v' | 'gf' | 'hot';

export type Dish = {
  id: string;
  cat: string;
  name: string;
  price: number;
  time: number;
  short: string;
  desc: string;
  photo?: Photo;
  diet: Diet[];
  pair?: string;
  tags: string;
  signature?: boolean;
  /** Tall product shot (e.g. a wine glass) shown contained rather than cropped. */
  tall?: boolean;
};

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'biryani', label: 'Biryani' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'mains', label: 'Mains' },
  { id: 'salads', label: 'Salads' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'sides', label: 'Sides' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'beverages', label: 'Beverages' },
] as const;

export const dietLabels: Record<Diet, [string, string]> = {
  v: ['V', 'Vegetarian'],
  gf: ['GF', 'Gluten-free'],
  hot: ['Spicy', 'Spicy'],
};

export const dishes: Dish[] = [
  // Biryani — the house speciality
  {
    id: 'signature', cat: 'biryani', name: 'HMR Signature Handi Biryani', price: 28, time: 30,
    short: 'Slow-cooked on dum, sealed handi',
    desc: 'Our most-loved dish: meat marinated overnight, layered with aged basmati and saffron, sealed in a handi and slow-cooked on dum. Opened at your door.',
    photo: photos.biryaniHandi, diet: ['gf', 'hot'], pair: 'Served with burani raita and mirchi ka salan.',
    tags: 'biryani chicken mutton handi dum signature rice hyderabadi indian spicy', signature: true,
  },
  {
    id: 'chicken-biryani', cat: 'biryani', name: 'Chicken Dum Biryani', price: 24, time: 25,
    short: 'The classic, garnished with mint',
    desc: 'Spiced chicken, long-grain basmati, saffron and crisp fried onions, cooked together on dum.',
    photo: photos.biryaniPlate, diet: ['gf'], pair: 'Add burani raita +$5.',
    tags: 'biryani chicken dum rice indian',
  },
  {
    id: 'mutton-biryani', cat: 'biryani', name: 'Hyderabadi Mutton Biryani', price: 32, time: 35,
    short: 'Kacchi-style, tender lamb',
    desc: 'Raw-marinated lamb and basmati cooked together in the kacchi style, finished with ghee, mint and birista.',
    photo: photos.biryaniMeat, diet: ['gf', 'hot'], pair: 'Best with mirchi ka salan.',
    tags: 'biryani mutton lamb goat kacchi hyderabadi dum rice indian spicy',
  },
  {
    id: 'royal-biryani', cat: 'biryani', name: 'Shahi Dry-Fruit Biryani', price: 26, time: 30,
    short: 'Cashews, raisins, rose water',
    desc: 'A royal biryani finished with toasted cashews, golden raisins, rose water and kewra.',
    photo: photos.biryaniCashew, diet: ['gf'], pair: 'Pairs with a glass of chilled rosé.',
    tags: 'biryani shahi royal nuts cashew dry fruit rice indian',
  },
  {
    id: 'egg-biryani', cat: 'biryani', name: 'Anda (Egg) Biryani', price: 18, time: 20,
    short: 'Masala eggs, saffron rice',
    desc: 'Boiled eggs tossed in a roasted masala and layered through fragrant saffron basmati.',
    photo: photos.biryaniRice, diet: ['v', 'gf'], pair: 'Add burani raita +$5.',
    tags: 'biryani egg anda vegetarian rice indian',
  },
  {
    id: 'veg-biryani', cat: 'biryani', name: 'Subz Dum Biryani', price: 18, time: 25,
    short: 'Garden vegetables, whole spices',
    desc: 'Seasonal vegetables, whole spices and saffron rice slow-cooked together on dum.',
    photo: photos.biryaniNuts, diet: ['v', 'gf'], pair: 'Add burani raita +$5.',
    tags: 'biryani vegetable veg subz vegetarian vegan rice indian',
  },
  {
    id: 'family-handi', cat: 'biryani', name: 'Family Handi Biryani', price: 89, time: 40,
    short: 'Serves 4 · with raita & salad',
    desc: 'A grand handi for four, opened at your table, with raita, salan, salad and double ka meetha. Tell us chicken or mutton in your kitchen notes.',
    photo: photos.biryaniSpread, diet: ['gf', 'hot'], pair: 'Includes raita, salan and dessert for four.',
    tags: 'biryani family sharing handi group chicken mutton rice indian',
  },

  // Mains
  {
    id: 'wagyu', cat: 'mains', name: 'Wagyu Striploin', price: 62, time: 25,
    short: 'Truffle jus, roasted vegetables',
    desc: 'A premium cut, grilled to perfection, with seasonal vegetables and jus.',
    photo: food('featured'), diet: ['gf'], pair: 'Pairs with our Reserve Cabernet Sauvignon.',
    tags: 'beef steak grill dinner',
  },
  {
    id: 'lobster', cat: 'mains', name: 'Lobster Linguine', price: 48, time: 20,
    short: 'Shellfish bisque, chilli, basil',
    desc: 'Fresh lobster, hand-tossed linguine in a rich shellfish bisque.',
    photo: food('lobster'), diet: [], pair: 'Pairs with a chilled glass of Chablis.',
    tags: 'seafood pasta italian dinner',
  },
  {
    id: 'salmon', cat: 'mains', name: 'Atlantic Salmon', price: 38, time: 20,
    short: 'Herb butter, seasonal greens',
    desc: 'Crisp-skinned Atlantic salmon, lemon-herb butter and tender seasonal greens.',
    photo: food('salmon'), diet: ['gf'], pair: 'Pairs with Sancerre.',
    tags: 'fish seafood healthy dinner',
  },
  {
    id: 'fettuccine', cat: 'mains', name: 'Truffle Fettuccine', price: 34, time: 18,
    short: 'Black truffle, parmesan',
    desc: 'Fresh egg fettuccine folded through black truffle butter and aged parmesan.',
    photo: food('fettuccine'), diet: ['v'], pair: 'Pairs with a white Burgundy.',
    tags: 'pasta italian vegetarian truffle',
  },
  {
    id: 'burger', cat: 'mains', name: 'HMR Signature Burger', price: 28, time: 18,
    short: 'Aged cheddar, truffle fries',
    desc: 'Dry-aged beef patty, aged cheddar, caramelised onion and house pickles on brioche, with truffle fries.',
    photo: food('burger'), diet: [], pair: 'Pairs with a craft lager.',
    tags: 'beef burger fries american comfort',
  },

  // Breakfast
  {
    id: 'croissant', cat: 'breakfast', name: 'Butter Croissant Basket', price: 14, time: 10,
    short: 'Jam, cultured butter',
    desc: 'Freshly baked all-butter croissants, seasonal preserves and cultured butter.',
    photo: food('croissant'), diet: ['v'], pair: 'Perfect with a flat white.',
    tags: 'pastry bakery morning french',
  },
  {
    id: 'garden', cat: 'breakfast', name: 'Garden Harvest Bowl', price: 19, time: 10,
    short: 'Grains, greens, citrus',
    desc: 'Ancient grains, charred greens, roasted squash and citrus vinaigrette.',
    photo: food('garden-bowl'), diet: ['v'], tags: 'bowl vegan healthy grains morning',
  },

  // Salads
  {
    id: 'caesar', cat: 'salads', name: 'Classic Caesar Salad', price: 24, time: 10,
    short: 'Romaine, parmesan, croutons',
    desc: 'Crisp romaine, shaved parmesan, sourdough croutons and anchovy dressing.',
    photo: food('caesar'), diet: [], pair: 'Add grilled chicken +$8.',
    tags: 'salad lunch light all-day',
  },
  {
    id: 'burrata', cat: 'salads', name: 'Burrata Salad', price: 22, time: 10,
    short: 'Heirloom tomato, balsamic',
    desc: 'Creamy burrata, heirloom tomatoes, arugula, balsamic glaze.',
    photo: food('burrata'), diet: ['v', 'gf'], pair: 'Pairs with a dry rosé.',
    tags: 'salad cheese italian vegetarian light all-day',
  },

  // Sandwiches
  {
    id: 'club', cat: 'sandwiches', name: 'Truffle Club Sandwich', price: 28, time: 15,
    short: 'Chicken, truffle aioli, sourdough',
    desc: 'Roasted chicken, truffle aioli, aged cheddar, on sourdough.',
    photo: food('club'), diet: [], pair: 'Served with truffle fries.',
    tags: 'sandwich chicken lunch all-day',
  },

  // Sides
  {
    id: 'raita', cat: 'sides', name: 'Burani Raita', price: 5, time: 5,
    short: 'Smoked garlic yoghurt, cucumber',
    desc: 'Cool yoghurt with smoked garlic, cucumber, mint and a dusting of chilli — the perfect partner for biryani.',
    photo: photos.raita, diet: ['v', 'gf'], tags: 'raita yoghurt side biryani indian',
  },
  {
    id: 'salan', cat: 'sides', name: 'Mirchi ka Salan', price: 7, time: 8,
    short: 'Green chillies, peanut-sesame gravy',
    desc: 'The Hyderabadi classic: green chillies simmered in a tangy peanut, sesame and tamarind gravy.',
    diet: ['v', 'gf', 'hot'], tags: 'salan mirchi chilli gravy side biryani hyderabadi indian spicy',
  },

  // Desserts
  {
    id: 'fondant', cat: 'desserts', name: 'Dark Chocolate Fondant', price: 16, time: 18,
    short: 'Raspberry, vanilla ice cream',
    desc: 'Warm chocolate fondant with vanilla ice cream and berries.',
    photo: food('fondant'), diet: ['v'], pair: 'Pairs with a glass of tawny port.',
    tags: 'chocolate sweet dessert',
  },
  {
    id: 'meetha', cat: 'desserts', name: 'Double ka Meetha', price: 9, time: 10,
    short: 'Saffron bread pudding, nuts',
    desc: 'Fried bread soaked in saffron-cardamom milk, finished with almonds and pistachios.',
    diet: ['v'], pair: 'A sweet finish to any biryani.',
    tags: 'dessert sweet hyderabadi indian saffron bread pudding',
  },

  // Beverages
  {
    id: 'cabernet', cat: 'beverages', name: 'Reserve Cabernet Sauvignon', price: 18, time: 5,
    short: 'Glass · Napa Valley',
    desc: 'Blackcurrant, cedar and a long, velvet finish. Also available by the bottle.',
    photo: food('wine'), tall: true, diet: ['v', 'gf'], tags: 'wine red bar alcohol',
  },
  {
    id: 'lassi', cat: 'beverages', name: 'Salted Mint Lassi', price: 7, time: 5,
    short: 'Churned yoghurt, roasted cumin',
    desc: 'Chilled churned yoghurt with fresh mint and roasted cumin — the classic biryani cooler.',
    diet: ['v', 'gf'], tags: 'lassi yoghurt drink indian cooler',
  },
  {
    id: 'chai', cat: 'beverages', name: 'Masala Chai', price: 6, time: 5,
    short: 'Cardamom, ginger, clove',
    desc: 'Assam tea simmered with milk, cardamom, ginger and clove.',
    diet: ['v', 'gf'], tags: 'tea chai drink hot indian',
  },
];

export const dishById: Record<string, Dish> = Object.fromEntries(dishes.map(d => [d.id, d]));
