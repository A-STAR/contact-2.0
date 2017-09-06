import { Observable } from 'rxjs/Observable';

export const combineLatestAnd = (observables: Array<Observable<boolean>>) => {
  return Observable.combineLatest.apply(null, observables).map(res => res.reduce((acc, i) => acc && i), true);
}

export const combineLatestOr = (observables: Array<Observable<boolean>>) => {
  return Observable.combineLatest.apply(null, observables).map(res => res.reduce((acc, i) => acc || i), false);
}