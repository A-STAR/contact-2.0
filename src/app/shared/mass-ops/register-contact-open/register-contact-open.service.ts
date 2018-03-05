import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IContactRegistrationParams } from '@app/core/debt/debt.interface';

@Injectable()
export class RegisterContactOpenService {
  registerContactAction$ = new BehaviorSubject<Partial<IContactRegistrationParams>>(null);

  constructor() { }

}
