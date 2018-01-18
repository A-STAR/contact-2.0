import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactRegistrationService {
  mode: 'tree' | 'form' = 'tree';
  outcome;
}
