import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

import { isEmpty } from '../../../core/utils';

@Injectable()
export class ContactRegistrationService {
  step = 0;
  selectedNode$ = new BehaviorSubject<ITreeNode>(null);

  get isInvalid$(): Observable<boolean> {
    return this.selectedNode$.map(node => !(node && isEmpty(node.children)));
  }
}
