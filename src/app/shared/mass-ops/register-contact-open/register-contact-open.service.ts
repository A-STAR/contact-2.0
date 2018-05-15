import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { IContactRegistrationParams } from '@app/routes/workplaces/shared/debt/debt.interface';

@Injectable()
export class RegisterContactOpenService {
  registerContactAction$ = new Subject<Partial<IContactRegistrationParams>>();

  constructor() { }

}
