import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PledgeCardService {
  readonly person$ = new BehaviorSubject<any>(null);

  selectPerson(selection: any): void {
    this.person$.next(selection);
  }
}
