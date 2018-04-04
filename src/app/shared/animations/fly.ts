import { animate, AnimationMetadata, group, style, transition } from '@angular/animations';

export function fly(steps: AnimationMetadata[] = []): AnimationMetadata[] {
  return [
    transition(':enter', [
      style({ transform: 'translateY(-100px)', opacity: 0 }),
      group([
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
        ...steps,
      ]),
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0)', opacity: 1 }),
      group([
        animate('200ms ease-in', style({ transform: 'translateY(-100px)', opacity: 0 })),
        ...steps,
      ]),
    ]),
  ];
}
