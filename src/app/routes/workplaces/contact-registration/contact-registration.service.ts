import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../core/data/data.service';

import { isEmpty } from '../../../core/utils';
import { toTreeNodes } from '../../../core/utils/tree';

@Injectable()
export class ContactRegistrationService {
  constructor(
    private dataService: DataService,
  ) {}

  step = 0;
  selectedNode$ = new BehaviorSubject<ITreeNode>(null);

  get isInvalid$(): Observable<boolean> {
    return this.selectedNode$.map(node => !(node && isEmpty(node.children)));
  }
}
