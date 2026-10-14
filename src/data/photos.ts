/**
 * Photography.
 *
 * Hotel and biryani photos are free-licence stock images from Pexels (https://www.pexels.com/license/),
 * loaded from the Pexels CDN. They stand in for HMR's own photography: replace each entry with a path
 * in /public (for example '/img/hotel/lobby.jpg') once the hotel's photos are ready.
 *
 * Each photo lists fallbacks, tried in order if an image fails to load.
 */
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

export type Photo = { src: string[]; alt: string; credit?: string };

const photo = (alt: string, ...src: string[]): Photo => ({ alt, src });

export const photos = {
  // Biryani
  biryaniHandi: photo('Mutton biryani served in a traditional clay handi', px(16229982), px(4224305)),
  biryaniPlate: photo('Chicken biryani garnished with mint on a black plate', px(4224304), px(4224314)),
  biryaniPair: photo('Plates of chicken biryani on a dark table', px(4224305), px(4224304)),
  biryaniClassic: photo('Delicious chicken biryani', px(4224314), px(4224304)),
  biryaniSpread: photo('Indian biryani served with raita and salad', px(35287415), px(4224305)),
  biryaniCashew: photo('Biryani with cashews and whole spices', px(33430560), px(4224314)),
  biryaniNuts: photo('Vegetable biryani with rice and nuts', px(9645253), px(4224304)),
  biryaniBowl: photo('Biryani rice in a bowl', px(12737656), px(4224314)),
  biryaniRice: photo('Biryani with fragrant rice', px(7353393), px(4224305)),
  biryaniMeat: photo('Rice with spiced fried meat in a bowl', px(9609865), px(16229982)),
  raita: photo('Indian raita with cherry tomatoes and herbs', px(35552952)),

  // Hotel
  exterior: photo('The hotel and pool lit up at night', px(919), px(24807132)),
  lobby: photo('Spacious hotel lobby with chandeliers', px(695193), px(18426842)),
  pool: photo('Infinity pool with sun loungers at sunset', px(24807132), px(24807133), px(919)),
  poolDeck: photo('Pool deck with loungers and a scenic view', px(24805046), px(14387344)),
  spa: photo('Candles and incense in a calm spa room', px(3865773), px(3865712)),
  restaurant: photo('Elegant restaurant with golden details and a crystal chandelier', px(6662510), px(941861)),
  dining: photo('Wine glasses on dressed tables', px(941861), px(6662510)),
  bar: photo('Luxurious hotel bar with marble counter and warm lighting', px(12391797), px(5371919)),
  barVintage: photo('Hotel bar with chandeliers', px(5371919), px(5490965)),
  gym: photo('Modern fitness studio with machines and equipment', px(7031705), px(17227607)),

  // Rooms
  roomDeluxe: photo('Deluxe king room with a large bed', px(18285941), px(14580368)),
  roomTerrace: photo('Hotel room with a window nook and stylish decor', px(17417642), px(5379175)),
  roomExecutive: photo('Executive suite with living area', px(5379175), px(8082235)),
  roomPresidential: photo('Luxurious suite with chandeliers and classic furniture', px(18285946), px(8082235)),
  roomDetail: photo('Furniture in a hotel room', px(8082235), px(5379175)),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Local food photography from the original HMR menu mockups. */
export const food = (name: string): Photo => ({ src: [`/img/food/${name}.webp`], alt: '' });
