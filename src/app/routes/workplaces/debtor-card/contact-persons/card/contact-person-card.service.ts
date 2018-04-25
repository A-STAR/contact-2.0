import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ContactPersonCardService {
  readonly contactPerson$ = new BehaviorSubject<any>(null);

  selectContactPerson(contactPerson: any): void {
    this.contactPerson$.next(contactPerson);
  }
}
