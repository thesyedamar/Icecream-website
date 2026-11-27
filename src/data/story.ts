import storyCupBaseImg from '../assets/images/story_cup_base_1794669904822.jpg';

export interface StoryValue {
  id: string;
  title: string;
  metric: string;
  description: string;
}

export const STORY_PARAGRAPH =
  'Every Swirl Creamery cup begins before dawn with pasture-raised cream, roasted nuts, and hand-steeped botanicals churned slowly in tiny kettles so each scoop holds a velvety ribbon of joy.';

export const STORY_VALUES: StoryValue[] = [
  {
    id: 'small-batch',
    title: 'Small batch',
    metric: '24 pints / churn',
    description: 'Slow-churned daily with low overrun for dense, spoon-hugging creaminess.',
  },
  {
    id: 'real-ingredients',
    title: 'Real ingredients',
    metric: '0% gums or dyes',
    description: 'Whole Madagascar pods, Sicilian-style pistachios, and fresh orchard fruit.',
  },
  {
    id: 'nine-flavors',
    title: 'Nine flavors',
    metric: '9 signature cups',
    description: 'From nostalgic field strawberry to saffron cardamom brewed for celebration.',
  },
];

export const STORY_CUP_IMAGE = storyCupBaseImg;
