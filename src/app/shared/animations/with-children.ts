import { AnimationMetadata, animateChild, query } from '@angular/animations';

export function withChildren(selector: string): AnimationMetadata {
  return query(selector, [ animateChild() ]);
}
