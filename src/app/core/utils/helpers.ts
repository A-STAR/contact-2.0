import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map } from 'rxjs/operators';

export const combineLatestAnd = (observables: Array<Observable<boolean>>): Observable<boolean> => {
  return combineLatest.apply(null, observables).pipe(
    map((res: boolean[]) => res.reduce((acc, i) => acc && i), true),
  );
};

export const combineLatestOr = (observables: Array<Observable<boolean>>): Observable<boolean> => {
  return combineLatest.apply(null, observables).pipe(
    map((res: boolean[]) => res.reduce((acc, i) => acc || i), false),
  );
};

export const doOnceIf = (observable: Observable<boolean>, callback: Function): void => {
  observable
    .pipe(
      first(),
      filter(Boolean),
    ).subscribe(() => callback());
};
