import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAverageRating,
  computeMarqueeCenterOffset,
  stepConveyorOrder,
  stepsToFront,
} from './conveyorLogic';
import {
  getStoryWordLitCount,
  getToppingParticleState,
  STORY_TOPPINGS,
} from './storySequence';

test('stepConveyorOrder moves front item to top-back and advances all others forward', () => {
  const initial = ['strawberry', 'pistachio', 'vanilla', 'caramel', 'chocolate'];
  const next = stepConveyorOrder(initial);
  assert.deepEqual(next, ['chocolate', 'strawberry', 'pistachio', 'vanilla', 'caramel']);
});

test('stepsToFront computes shortest step count to reach front slot', () => {
  const order = ['strawberry', 'pistachio', 'vanilla', 'caramel', 'chocolate'];
  assert.equal(stepsToFront(order, 'chocolate'), 0);
  assert.equal(stepsToFront(order, 'caramel'), 1);
  assert.equal(stepsToFront(order, 'strawberry'), 4);

  let stepped = [...order];
  const steps = stepsToFront(stepped, 'pistachio');
  for (let i = 0; i < steps; i++) {
    stepped = stepConveyorOrder(stepped);
  }
  assert.equal(stepped[stepped.length - 1], 'pistachio');
});

test('computeAverageRating rounds to one decimal place', () => {
  assert.equal(computeAverageRating([5, 5, 5, 4]), 4.8);
  assert.equal(computeAverageRating([]), 5.0);
});

test('computeMarqueeCenterOffset aligns target card center with viewport center', () => {
  const offset = computeMarqueeCenterOffset(2, 9, 260, 24, 1440);
  // card 2 center = 2 * 284 + 130 = 698; 720 - 698 = 22
  assert.equal(offset, 22);
});

test('storySequence word lighting and topping particles progress deterministically', () => {
  assert.equal(getStoryWordLitCount(30, 0), 0);
  assert.equal(getStoryWordLitCount(30, 0.5), 15);
  assert.equal(getStoryWordLitCount(30, 1), 30);

  const firstTopping = STORY_TOPPINGS[0];
  const hidden = getToppingParticleState(firstTopping, 0);
  assert.equal(hidden.visible, false);

  const landed = getToppingParticleState(firstTopping, 1);
  assert.equal(landed.visible, true);
  assert.equal(landed.localProgress, 1);
  assert.equal(landed.yProgress, 1);
});
