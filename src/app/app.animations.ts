import { trigger, state, style, transition, animate } from '@angular/core';

export const onInitAnimation = trigger('appVisibility', [
  state('initial', style({
    opacity: '0',
  })),
  state('visible',   style({
    opacity: '1',
  })),
  transition('initial => visible', animate('300ms ease')),
]);
