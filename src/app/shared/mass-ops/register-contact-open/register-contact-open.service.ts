import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { IContactRegistrationParams } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Injectable()
export class RegisterContactOpenService {
  registerContactAction$ = new Subject<Partial<IContactRegistrationParams>>();

  constructor() { }

}
