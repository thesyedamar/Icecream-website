export interface CustomerReview {
  id: string;
  name: string;
  initials: string;
  city: string;
  rating: number;
  quote: string;
  flavorId: string;
  row: 1 | 2;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Ananya Sharma',
    initials: 'AS',
    city: 'Mumbai',
    rating: 5,
    quote:
      'The Saffron Cardamom tastes like real crushed elaichi and slow-simmered milk—never artificial. Best festive dessert box we gifted.',
    flavorId: 'saffron',
    row: 1,
  },
  {
    id: 'rev-2',
    name: 'Maya Lin',
    initials: 'ML',
    city: 'San Francisco',
    rating: 5,
    quote:
      'Roasted Pistachio has actual nutty crunch in every spoonful. Smooth, balanced, and not overly sweet.',
    flavorId: 'pistachio',
    row: 1,
  },
  {
    id: 'rev-3',
    name: 'Liam Carter',
    initials: 'LC',
    city: 'Austin',
    rating: 5,
    quote:
      'Strawberry Swirl reminds me of summer farm stands. Those tangy berry ribbons cut straight through the cream.',
    flavorId: 'strawberry',
    row: 1,
  },
  {
    id: 'rev-4',
    name: 'Priya Patel',
    initials: 'PP',
    city: 'Chicago',
    rating: 5,
    quote:
      'Ordered the Diwali Gift Box for family dinner and everyone fought over the Salted Caramel cup. Arrived rock solid!',
    flavorId: 'caramel',
    row: 1,
  },
  {
    id: 'rev-5',
    name: 'Noah Bennett',
    initials: 'NB',
    city: 'Brooklyn',
    rating: 5,
    quote:
      'Madagascar Vanilla looks simple until you taste the real vanilla bean specks. Pure custard perfection.',
    flavorId: 'vanilla',
    row: 2,
  },
  {
    id: 'rev-6',
    name: 'Elena Rossi',
    initials: 'ER',
    city: 'Seattle',
    rating: 5,
    quote:
      'Belgian Dark Chocolate is unapologetically rich without feeling heavy. The fudge curls are dangerous.',
    flavorId: 'chocolate',
    row: 2,
  },
  {
    id: 'rev-7',
    name: 'Rohan Mehta',
    initials: 'RM',
    city: 'Jersey City',
    rating: 5,
    quote:
      'Alphonso Mango brings real Ratnagiri sunshine in a cup. Bright, silky, and gone in five minutes.',
    flavorId: 'mango',
    row: 2,
  },
  {
    id: 'rev-8',
    name: 'Chloe Brooks',
    initials: 'CB',
    city: 'Portland',
    rating: 5,
    quote:
      'Blueberry Cheesecake has actual buttery graham crumble mixed right up to the brim. Obsessed.',
    flavorId: 'blueberry',
    row: 2,
  },
];

export const TOTAL_REVIEW_COUNT = 1248;
