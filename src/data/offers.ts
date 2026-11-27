export interface DiwaliOffer {
  id: string;
  title: string;
  discountBadge: string;
  description: string;
  code: string;
  bundlePrice: number;
  originalPrice: number;
  flavorIds: string[];
  bundleItemName: string;
}

export const DIWALI_OFFERS: DiwaliOffer[] = [
  {
    id: 'festive-gift-box',
    title: 'Festive Gift Box',
    discountBadge: '25% OFF',
    description:
      'Four artisanal cups — Saffron Cardamom, Roasted Pistachio, Salted Caramel, and Strawberry Swirl — packed in an insulated gold-foil keepsake box.',
    code: 'DIWALI25',
    bundlePrice: 22.15,
    originalPrice: 29.5,
    flavorIds: ['saffron', 'pistachio', 'caramel', 'strawberry'],
    bundleItemName: 'Diwali Festive Gift Box (4 Cups)',
  },
  {
    id: 'buy-2-get-1',
    title: 'Buy 2 Get 1 Free',
    discountBadge: '3 FOR 2',
    description:
      'Celebrate with our crowd-pleasing trio: Strawberry Swirl, Madagascar Vanilla, and Belgian Dark Chocolate. One full cup is on the house.',
    code: 'SWIRL3FOR2',
    bundlePrice: 13.5,
    originalPrice: 19.5,
    flavorIds: ['strawberry', 'vanilla', 'chocolate'],
    bundleItemName: 'Diwali Trio Bundle (Buy 2 Get 1)',
  },
  {
    id: 'pistachio-caramel-pair',
    title: 'Pistachio + Caramel Pair',
    discountBadge: 'SAVE $2.50',
    description:
      'Roasted green pistachio paired with copper-kettle salted caramel — our warmest sweet-and-savory duo for late-night festive gatherings.',
    code: 'NUTTYGOLD',
    bundlePrice: 12.0,
    originalPrice: 14.5,
    flavorIds: ['pistachio', 'caramel'],
    bundleItemName: 'Pistachio + Caramel Duo Bundle',
  },
];
