import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IContactRegistrationMode, IOutcome } from './contact-registration.interface';

@Injectable()
export class ContactRegistrationService {
  mode = IContactRegistrationMode.TREE;
  outcome: IOutcome;
}
