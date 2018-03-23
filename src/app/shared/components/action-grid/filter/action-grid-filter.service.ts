import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ActionGridFilterService {
  // notify subscribers, that grid has filters
  hasFilter$ = new BehaviorSubject<boolean>(null);
}
