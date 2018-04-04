import { animateChild, query } from '@angular/animations';

export const withChildren = (selector: string) => query(selector, [ animateChild() ]);
