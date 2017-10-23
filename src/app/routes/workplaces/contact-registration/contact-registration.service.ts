import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

import { isEmpty } from '../../../core/utils';

@Injectable()
export class ContactRegistrationService {
  guid: string;
  selectedNode$ = new BehaviorSubject<ITreeNode>(null);
  step = 0;

  get isInvalid$(): Observable<boolean> {
    return this.selectedNode$.map(node => !(node && isEmpty(node.children)));
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }
}
