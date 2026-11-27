export interface Flavor {
  id: string;
  name: string;
  shortName: string;
  price: number;
  heroTint: string;
  swatchColor: string;
  swirlColor: string;
  circleBg: string;
  description: string;
  notes: string;
  image: string;
  soldCount: number;
  bestSellerRank?: number;
  bestSellerTag?: string;
  featuredInConveyor?: boolean;
}

export const FLAVORS: Flavor[] = [
  {
    id: 'strawberry',
    name: 'Strawberry Swirl',
    shortName: 'Strawberry',
    price: 6.5,
    heroTint: '#f9d8e2',
    swatchColor: '#e86f8c',
    swirlColor: '#f29eb3',
    circleBg: '#f6d5df',
    description: 'Sun-ripened field strawberries churned with sweet cream and tart berry ribbons.',
    notes: 'Sweet Cream · Berry Ripple',
    image: '/src/assets/images/cup_strawberry_swirl_1794669902130.jpg',
    soldCount: 4820,
    bestSellerRank: 1,
    bestSellerTag: 'Most loved',
    featuredInConveyor: true,
  },
  {
    id: 'pistachio',
    name: 'Roasted Pistachio',
    shortName: 'Pistachio',
    price: 7.5,
    heroTint: '#dcecd4',
    swatchColor: '#7ea86e',
    swirlColor: '#a6ca95',
    circleBg: '#d9ebd2',
    description: 'Slow-roasted green pistachios stone-ground into velvety dairy with toasted nut crunch.',
    notes: 'Roasted Nuts · Sea Salt',
    image: '/src/assets/images/cup_roasted_pistachio_1794669901672.jpg',
    soldCount: 4190,
    bestSellerRank: 2,
    bestSellerTag: 'Fan favorite',
    featuredInConveyor: true,
  },
  {
    id: 'vanilla',
    name: 'Madagascar Vanilla',
    shortName: 'Vanilla',
    price: 6.0,
    heroTint: '#fbf0c9',
    swatchColor: '#ebd074',
    swirlColor: '#f2dc8c',
    circleBg: '#faecc0',
    description: 'Whole cured Madagascar vanilla pods steeped for 24 hours in farm-fresh sweet cream.',
    notes: 'Vanilla Pod · Silky Custard',
    image: '/src/assets/images/cup_madagascar_vanilla_1794669902183.jpg',
    soldCount: 3640,
    featuredInConveyor: true,
  },
  {
    id: 'caramel',
    name: 'Salted Caramel',
    shortName: 'Caramel',
    price: 7.0,
    heroTint: '#f6dfc4',
    swatchColor: '#d98f46',
    swirlColor: '#e5ab6c',
    circleBg: '#f5d9b8',
    description: 'Copper-kettle burnt sugar caramel folded with flaky Maldon sea salt crystals.',
    notes: 'Burnt Sugar · Flaky Salt',
    image: '/src/assets/images/cup_salted_caramel_1794669902336.jpg',
    soldCount: 3910,
    bestSellerRank: 3,
    bestSellerTag: 'Rich classic',
    featuredInConveyor: true,
  },
  {
    id: 'chocolate',
    name: 'Belgian Dark Chocolate',
    shortName: 'Chocolate',
    price: 7.0,
    heroTint: '#e6d4cd',
    swatchColor: '#6f4235',
    swirlColor: '#9c6e5f',
    circleBg: '#e2cec6',
    description: 'Single-origin 70% dark couverture cocoa whipped with deep fudge ribbons and curls.',
    notes: '70% Cocoa · Fudge Ribbon',
    image: '/src/assets/images/cup_belgian_chocolate_1794669903211.jpg',
    soldCount: 3480,
    featuredInConveyor: true,
  },
  {
    id: 'mango',
    name: 'Alphonso Mango',
    shortName: 'Mango',
    price: 7.25,
    heroTint: '#fbe4b8',
    swatchColor: '#f2a93b',
    swirlColor: '#f5be63',
    circleBg: '#fce0aa',
    description: 'Ratnagiri Alphonso mangoes blended smooth with bright citrus zest and juicy fruit cubes.',
    notes: 'Alphonso Puree · Bright Citrus',
    image: '/src/assets/images/cup_alphonso_mango_1794669903245.jpg',
    soldCount: 2890,
  },
  {
    id: 'blueberry',
    name: 'Blueberry Cheesecake',
    shortName: 'Blueberry',
    price: 7.5,
    heroTint: '#e2dff4',
    swatchColor: '#8d84c9',
    swirlColor: '#afa8de',
    circleBg: '#dedaf2',
    description: 'Cultured cream cheese ice cream swirled with wild blueberry compote and graham crumble.',
    notes: 'Wild Berry · Graham Crumble',
    image: '/src/assets/images/cup_blueberry_cheesecake_1794669903640.jpg',
    soldCount: 2710,
  },
  {
    id: 'mint',
    name: 'Mint Choc Chip',
    shortName: 'Mint Chip',
    price: 6.75,
    heroTint: '#d5eee5',
    swatchColor: '#69b89b',
    swirlColor: '#91d1b9',
    circleBg: '#d0ece2',
    description: 'Garden-steeped fresh peppermint cream studded with crisp dark chocolate shards.',
    notes: 'Fresh Mint · Cocoa Shards',
    image: '/src/assets/images/cup_mint_choc_chip_1794669903941.jpg',
    soldCount: 2540,
  },
  {
    id: 'saffron',
    name: 'Saffron Cardamom',
    shortName: 'Kesar Elaichi',
    price: 8.0,
    heroTint: '#f8e6ba',
    swatchColor: '#e2a336',
    swirlColor: '#ecc06b',
    circleBg: '#f6dfb0',
    description: 'Kashmiri saffron threads and freshly cracked green cardamom topped with toasted almonds.',
    notes: 'Kashmiri Kesar · Roasted Almond',
    image: '/src/assets/images/cup_saffron_cardamom_1794669904847.jpg',
    soldCount: 3750,
    bestSellerRank: 4,
    bestSellerTag: 'Festive pick',
  },
];

export const CONVEYOR_FLAVORS: Flavor[] = FLAVORS.filter((f) => f.featuredInConveyor);

export const BEST_SELLER_FLAVORS: Flavor[] = FLAVORS.filter(
  (f) => typeof f.bestSellerRank === 'number'
).sort((a, b) => (a.bestSellerRank ?? 99) - (b.bestSellerRank ?? 99));

export const FLAVOR_BY_ID: Record<string, Flavor> = Object.fromEntries(
  FLAVORS.map((f) => [f.id, f])
);
