import { animate, AnimationMetadata, group, style, transition } from '@angular/animations';

export const fade = (steps: AnimationMetadata[] = []) => [
  transition(':enter', [
    style({ opacity: 0 }),
    group([
      animate('200ms ease-out', style({ opacity: 1 })),
      ...steps,
    ]),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    group([
      animate('200ms ease-in', style({ opacity: 0 })),
      ...steps,
    ]),
  ]),
];
