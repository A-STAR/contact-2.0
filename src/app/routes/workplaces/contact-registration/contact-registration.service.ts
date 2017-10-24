import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../core/data/data.service';

import { isEmpty } from '../../../core/utils';

@Injectable()
export class ContactRegistrationService {
  guid: string;
  selectedNode$ = new BehaviorSubject<ITreeNode>(null);
  step = 0;

  constructor(
    private dataService: DataService,
  ) {}

  get isInvalid$(): Observable<boolean> {
    return this.selectedNode$.map(node => !(node && isEmpty(node.children)));
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  confirm(debtId: number): Observable<any> {
    return this.dataService
      // TODO(d.maltsev): error handling
      .create('/debts/{debtId}/contactRequest/{guid}/save', { debtId, guid: this.guid }, {});
  }
}
