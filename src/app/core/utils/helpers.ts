import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

export const combineLatestAnd = (observables: Array<Observable<boolean>>): Observable<boolean> => {
  return Observable.combineLatest.apply(null, observables).map(res => res.reduce((acc, i) => acc && i), true);
};

export const combineLatestOr = (observables: Array<Observable<boolean>>): Observable<boolean> => {
  return Observable.combineLatest.apply(null, observables).map(res => res.reduce((acc, i) => acc || i), false);
};

export const doOnceIf = (observable: Observable<boolean>, callback: Function): void => {
  observable.pipe(first()).filter(Boolean).subscribe(() => callback());
};
