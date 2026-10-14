/* HMR In-Room Dining — menu data.
   Prices in USD. `img` is optional; dishes without a photo get an illustrated plate. */
window.HMR_MENU = {
  categories: [
    { id: 'all', label: 'All' },
    { id: 'biryani', label: 'Biryani' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'mains', label: 'Mains' },
    { id: 'salads', label: 'Salads' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'sides', label: 'Sides' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'beverages', label: 'Beverages' }
  ],

  dishes: [
    // Biryani — the house speciality
    {
      id: 'signature', cat: 'biryani', name: 'HMR Signature Handi Biryani', price: 28, time: 30,
      short: 'Chicken, saffron, sealed copper handi',
      desc: 'Our most-loved dish: chicken marinated overnight, layered with aged basmati and saffron, sealed in a copper handi and slow-cooked on dum. Opened at your door.',
      img: 'assets/img/biryani/signature-biryani.webp',
      diet: ['gf', 'hot'], pair: 'Served with burani raita and mirchi ka salan.',
      tags: 'biryani chicken handi dum signature rice hyderabadi indian spicy', signature: true
    },
    {
      id: 'mutton-biryani', cat: 'biryani', name: 'Hyderabadi Mutton Biryani', price: 32, time: 35,
      short: 'Kacchi-style, tender lamb on the bone',
      desc: 'Raw-marinated lamb and basmati cooked together on dum in the kacchi style, finished with ghee, mint and crisp birista.',
      img: 'assets/img/biryani/mutton-biryani.webp',
      diet: ['gf', 'hot'], pair: 'Best with mirchi ka salan.',
      tags: 'biryani mutton lamb goat kacchi hyderabadi dum rice indian spicy'
    },
    {
      id: 'chicken-biryani', cat: 'biryani', name: 'Chicken Dum Biryani', price: 24, time: 25,
      short: 'Classic, on the plate',
      desc: 'The classic: spiced chicken, long-grain basmati, saffron and fried onions, cooked on dum and served on the plate.',
      img: 'assets/img/biryani/chicken-biryani.webp',
      diet: ['gf'], pair: 'Add burani raita +$5.',
      tags: 'biryani chicken dum rice indian'
    },
    {
      id: 'prawn-biryani', cat: 'biryani', name: 'Jhinga (Prawn) Biryani', price: 30, time: 25,
      short: 'Tiger prawns, coastal spices',
      desc: 'Tiger prawns in a coconut-kissed coastal masala, layered with saffron rice and curry leaves.',
      img: 'assets/img/biryani/prawn-biryani.webp',
      diet: ['gf', 'hot'], pair: 'Pairs with a chilled glass of Riesling.',
      tags: 'biryani prawn shrimp jhinga seafood rice indian spicy'
    },
    {
      id: 'egg-biryani', cat: 'biryani', name: 'Anda (Egg) Biryani', price: 18, time: 20,
      short: 'Masala eggs, saffron rice',
      desc: 'Boiled eggs tossed in a roasted masala and layered through fragrant saffron basmati.',
      img: 'assets/img/biryani/egg-biryani.webp',
      diet: ['v', 'gf'], pair: 'Add burani raita +$5.',
      tags: 'biryani egg anda vegetarian rice indian'
    },
    {
      id: 'paneer-biryani', cat: 'biryani', name: 'Paneer Tikka Biryani', price: 20, time: 25,
      short: 'Char-grilled paneer, mint',
      desc: 'Tandoor-charred paneer tikka layered with mint, saffron and aged basmati.',
      img: 'assets/img/biryani/paneer-biryani.webp',
      diet: ['v', 'gf'], pair: 'Best with mirchi ka salan.',
      tags: 'biryani paneer vegetarian tikka rice indian'
    },
    {
      id: 'veg-biryani', cat: 'biryani', name: 'Subz Dum Biryani', price: 18, time: 25,
      short: 'Garden vegetables, whole spices',
      desc: 'Seasonal vegetables, whole spices and saffron rice slow-cooked together on dum.',
      img: 'assets/img/biryani/veg-biryani.webp',
      diet: ['v', 'gf'], pair: 'Add burani raita +$5.',
      tags: 'biryani vegetable veg subz vegetarian vegan rice indian'
    },
    {
      id: 'family-handi', cat: 'biryani', name: 'Family Handi Biryani', price: 89, time: 40,
      short: 'Serves 4 · chicken or mutton',
      desc: 'A grand copper handi for four, opened at your table. Comes with raita, salan and double ka meetha. Tell us chicken or mutton in your kitchen notes.',
      img: 'assets/img/biryani/signature-biryani.webp',
      diet: ['gf', 'hot'], pair: 'Includes raita, salan and dessert for four.',
      tags: 'biryani family sharing handi group chicken mutton rice indian'
    },

    // Mains
    {
      id: 'wagyu', cat: 'mains', name: 'Wagyu Striploin', price: 62, time: 25,
      short: 'Truffle jus, roasted vegetables',
      desc: 'A premium cut, grilled to perfection, with seasonal vegetables and jus.',
      img: 'assets/img/wagyu.webp', hero: 'assets/img/featured.webp',
      diet: ['gf'], pair: 'Pairs with our Reserve Cabernet Sauvignon.',
      tags: 'beef steak grill dinner signature', signature: true
    },
    {
      id: 'lobster', cat: 'mains', name: 'Lobster Linguine', price: 48, time: 20,
      short: 'Shellfish bisque, chilli, basil',
      desc: 'Fresh lobster, hand-tossed linguine in a rich shellfish bisque.',
      img: 'assets/img/lobster.webp',
      diet: [], pair: 'Pairs with a chilled glass of Chablis.',
      tags: 'seafood pasta italian dinner'
    },
    {
      id: 'salmon', cat: 'mains', name: 'Atlantic Salmon', price: 38, time: 20,
      short: 'Herb butter, seasonal greens',
      desc: 'Crisp-skinned Atlantic salmon, lemon-herb butter and tender seasonal greens.',
      img: 'assets/img/salmon.webp',
      diet: ['gf'], pair: 'Pairs with Sancerre.',
      tags: 'fish seafood healthy dinner'
    },
    {
      id: 'fettuccine', cat: 'mains', name: 'Truffle Fettuccine', price: 34, time: 18,
      short: 'Black truffle, parmesan',
      desc: 'Fresh egg fettuccine folded through black truffle butter and aged parmesan.',
      img: 'assets/img/fettuccine.webp',
      diet: ['v'], pair: 'Pairs with a white Burgundy.',
      tags: 'pasta italian vegetarian truffle'
    },
    {
      id: 'burger', cat: 'mains', name: 'HMR Signature Burger', price: 28, time: 18,
      short: 'Aged cheddar, truffle fries',
      desc: 'Dry-aged beef patty, aged cheddar, caramelised onion and house pickles on a brioche bun, with truffle fries.',
      img: 'assets/img/burger.webp',
      diet: [], pair: 'Pairs with a craft lager.',
      tags: 'beef burger fries american comfort signature', signature: true
    },

    // Breakfast
    {
      id: 'croissant', cat: 'breakfast', name: 'Butter Croissant Basket', price: 14, time: 10,
      short: 'Jam, cultured butter',
      desc: 'Freshly baked all-butter croissants, seasonal preserves and cultured butter.',
      img: 'assets/img/croissant.webp',
      diet: ['v'], pair: 'Perfect with a flat white.',
      tags: 'pastry bakery morning french'
    },
    {
      id: 'benedict', cat: 'breakfast', name: 'Eggs Benedict', price: 22, time: 15,
      short: 'Smoked ham, hollandaise',
      desc: 'Two poached eggs on toasted English muffin with smoked ham and warm hollandaise.',
      diet: [], pair: 'Add fresh-pressed orange juice.',
      tags: 'eggs morning brunch'
    },
    {
      id: 'avocado', cat: 'breakfast', name: 'Avocado Sourdough', price: 18, time: 12,
      short: 'Poached egg, chilli, lime',
      desc: 'Crushed avocado on toasted sourdough with a poached egg, chilli flakes and lime.',
      diet: ['v'], pair: 'Add fresh-pressed orange juice.',
      tags: 'eggs morning brunch healthy vegetarian'
    },
    {
      id: 'yoghurt', cat: 'breakfast', name: 'Seasonal Fruit & Yoghurt', price: 12, time: 8,
      short: 'Granola, honey',
      desc: 'Cut seasonal fruit, Greek yoghurt, house granola and wildflower honey.',
      diet: ['v', 'gf'], pair: '',
      tags: 'fruit healthy morning light'
    },

    // Salads
    {
      id: 'caesar', cat: 'salads', name: 'Classic Caesar Salad', price: 24, time: 10,
      short: 'Romaine, parmesan, croutons',
      desc: 'Crisp romaine, shaved parmesan, sourdough croutons and anchovy dressing.',
      img: 'assets/img/caesar.webp',
      diet: [], pair: 'Add grilled chicken +$8.',
      tags: 'salad lunch light all-day'
    },
    {
      id: 'burrata', cat: 'salads', name: 'Burrata Salad', price: 22, time: 10,
      short: 'Heirloom tomato, balsamic',
      desc: 'Creamy burrata, heirloom tomatoes, arugula, balsamic glaze.',
      img: 'assets/img/burrata.webp',
      diet: ['v', 'gf'], pair: 'Pairs with a dry rosé.',
      tags: 'salad cheese italian vegetarian light all-day'
    },
    {
      id: 'garden', cat: 'salads', name: 'Garden Harvest Bowl', price: 19, time: 10,
      short: 'Grains, greens, citrus',
      desc: 'Ancient grains, charred greens, roasted squash and citrus vinaigrette.',
      img: 'assets/img/garden-bowl.webp',
      diet: ['v'], pair: '',
      tags: 'salad bowl vegan healthy grains all-day'
    },

    // Sandwiches
    {
      id: 'club', cat: 'sandwiches', name: 'Truffle Club Sandwich', price: 28, time: 15,
      short: 'Chicken, truffle aioli, sourdough',
      desc: 'Roasted chicken, truffle aioli, aged cheddar, on sourdough.',
      img: 'assets/img/club.webp',
      diet: [], pair: 'Served with truffle fries.',
      tags: 'sandwich chicken lunch all-day'
    },

    // Sides
    {
      id: 'raita', cat: 'sides', name: 'Burani Raita', price: 5, time: 5,
      short: 'Smoked garlic yoghurt, cucumber',
      desc: 'Cool yoghurt with smoked garlic, cucumber, mint and a dusting of chilli — the perfect partner for biryani.',
      img: 'assets/img/biryani/raita.webp',
      diet: ['v', 'gf'], pair: '', tags: 'raita yoghurt side biryani indian'
    },
    {
      id: 'salan', cat: 'sides', name: 'Mirchi ka Salan', price: 7, time: 8,
      short: 'Green chillies, peanut-sesame gravy',
      desc: 'The Hyderabadi classic: green chillies simmered in a tangy peanut, sesame and tamarind gravy.',
      img: 'assets/img/biryani/salan.webp',
      diet: ['v', 'gf', 'hot'], pair: '', tags: 'salan mirchi chilli gravy side biryani hyderabadi indian spicy'
    },
    {
      id: 'fries', cat: 'sides', name: 'Truffle Fries', price: 9, time: 8,
      short: 'Parmesan, chives',
      desc: 'Hand-cut fries tossed in truffle oil, parmesan and chives.',
      diet: ['v', 'gf'], pair: '', tags: 'fries potato side'
    },
    {
      id: 'asparagus', cat: 'sides', name: 'Grilled Asparagus', price: 10, time: 8,
      short: 'Lemon, sea salt',
      desc: 'Char-grilled asparagus spears with lemon and flaked sea salt.',
      diet: ['v', 'gf'], pair: '', tags: 'vegetables side green'
    },
    {
      id: 'mash', cat: 'sides', name: 'Pomme Purée', price: 9, time: 8,
      short: 'Brown butter',
      desc: 'Silky potato purée finished with brown butter.',
      diet: ['v', 'gf'], pair: '', tags: 'potato side french'
    },

    // Desserts
    {
      id: 'meetha', cat: 'desserts', name: 'Double ka Meetha', price: 9, time: 10,
      short: 'Saffron bread pudding, nuts',
      desc: 'Fried bread soaked in saffron-cardamom milk and finished with almonds and pistachios.',
      img: 'assets/img/biryani/double-ka-meetha.webp',
      diet: ['v'], pair: 'A sweet finish to any biryani.',
      tags: 'dessert sweet hyderabadi indian saffron bread pudding'
    },
    {
      id: 'fondant', cat: 'desserts', name: 'Dark Chocolate Fondant', price: 16, time: 18,
      short: 'Raspberry, vanilla ice cream',
      desc: 'Warm chocolate fondant with vanilla ice cream and berries.',
      img: 'assets/img/fondant.webp',
      diet: ['v'], pair: 'Pairs with a glass of tawny port.',
      tags: 'chocolate sweet dessert', signature: true
    },
    {
      id: 'brulee', cat: 'desserts', name: 'Vanilla Crème Brûlée', price: 14, time: 10,
      short: 'Madagascan vanilla, shortbread',
      desc: 'Baked Madagascan vanilla custard, burnt-sugar crust and butter shortbread.',
      diet: ['v'], pair: '', tags: 'custard sweet dessert french'
    },

    // Beverages
    {
      id: 'cabernet', cat: 'beverages', name: 'Reserve Cabernet Sauvignon', price: 18, time: 5,
      short: 'Glass · Napa Valley',
      desc: 'Blackcurrant, cedar and a long, velvet finish. Also available by the bottle — ask our sommelier.',
      img: 'assets/img/wine.webp', tall: true,
      diet: ['v', 'gf'], pair: '', tags: 'wine red bar alcohol'
    },
    {
      id: 'oj', cat: 'beverages', name: 'Fresh Orange Juice', price: 8, time: 5,
      short: 'Pressed to order',
      desc: 'Oranges pressed to order, served over ice or straight.',
      diet: ['v', 'gf'], pair: '', tags: 'juice drink morning'
    },
    {
      id: 'espresso', cat: 'beverages', name: 'Espresso', price: 6, time: 5,
      short: 'Single origin',
      desc: 'Single-origin espresso, roasted in house. Ask for a flat white or cappuccino.',
      diet: ['v', 'gf'], pair: '', tags: 'coffee drink hot'
    },
    {
      id: 'water', cat: 'beverages', name: 'Sparkling Mineral Water', price: 7, time: 5,
      short: '750 ml',
      desc: 'Chilled Italian sparkling mineral water.',
      diet: ['v', 'gf'], pair: '', tags: 'water drink'
    }
  ]
};
