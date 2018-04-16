import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PledgeCardService {
  readonly person$ = new BehaviorSubject<number>(0);

  selectPerson(): void {
    this.person$.next(this.person$.value + 1);
  }
}
