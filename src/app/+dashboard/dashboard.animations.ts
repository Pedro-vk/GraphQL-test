import { trigger, state, style, transition, animate } from '@angular/core';

const transitionDuration: number = 300;
const hiddenState = {
  opacity: 0,
};
const visibleState = {
  opacity: 1,
};

export const onShowAnimation = trigger('onShowAnimation', [
  state('in', style(visibleState)),
  transition(':enter', [
    animate(transitionDuration, style(hiddenState)),
    style(hiddenState),
    animate(transitionDuration),
  ]),
  transition(':leave', [
    animate(transitionDuration, style(hiddenState)),
  ]),
]);
