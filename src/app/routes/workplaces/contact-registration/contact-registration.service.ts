import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../core/data/data.service';

import { isEmpty } from '../../../core/utils';

@Injectable()
export class ContactRegistrationService {
  selectedNode$ = new BehaviorSubject<ITreeNode>(null);
  autoComment$ = new BehaviorSubject<{ autoComment: string, autoCommentId: number, comment: string }>(null);

  private _guid$ = new BehaviorSubject<string>(null);

  constructor(
    private dataService: DataService,
  ) {}

  get guid(): string {
    return this._guid$.value;
  }

  get guid$(): Observable<string> {
    return this._guid$;
  }

  set guid(guid: string) {
    this._guid$.next(guid);
  }

  get isInvalid$(): Observable<boolean> {
    return this.selectedNode$.map(node => !this.isNodeValid(node));
  }

  get canAddPromise$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && [2, 3].includes(node.data.promiseMode));
  }

  get canAddPayment$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && [2, 3].includes(node.data.paymentMode));
  }

  get canAddNextCall$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && [2, 3].includes(node.data.nextCallMode));
  }

  get canAddComment$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && [2, 3].includes(node.data.commentMode));
  }

  get canAddAutoComment$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && !!node.data.autoCommentIds);
  }

  get canAddPhone$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && Number(node.data.addPhone) === 1);
  }

  get canChangeContact$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && Number(node.data.changeContactPerson) === 1);
  }

  get canAddDebtReason$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && [2, 3].includes(node.data.debtReasonMode));
  }

  get canAddRefusal$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && Number(node.data.isRefusal) === 1);
  }

  get canAddFile$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && [2, 3].includes(node.data.fileAttachMode));
  }

  get canAddCallReason$(): Observable<boolean> {
    return this.selectedNode$.map(node => this.isNodeValid(node) && [2, 3].includes(node.data.callReasonMode));
  }

  get canAddStatusChangeReason$(): Observable<boolean> {
    return this.selectedNode$
      .map(node => this.isNodeValid(node) && [2, 3].includes(node.data.statusReasonMode) && !!node.data.debtStatusCode);
  }

  confirm(debtId: number): Observable<any> {
    return this.dataService
      // TODO(d.maltsev): error handling
      .create('/debts/{debtId}/contactRequest/{guid}/save', { debtId, guid: this.guid }, {});
  }

  private isNodeValid(node: ITreeNode): boolean {
    return node && isEmpty(node.children);
  }
}
