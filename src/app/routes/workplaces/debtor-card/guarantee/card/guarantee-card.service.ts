import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GuaranteeCardService {
  readonly guarantor$ = new BehaviorSubject<any>(null);

  selectGuarantor(guarantor: any): void {
    this.guarantor$.next(guarantor);
  }
}
