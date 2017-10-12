import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { UserTemplatesService } from '../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { isEmpty, makeKey, valuesToOptions } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.outcomeForm')

@Component({
  selector: 'app-outcome-form',
  templateUrl: './outcome-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeFormComponent implements OnInit, AfterViewInit {
  @Input() debtId: number;
  @Input() contactTypeCode: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { label: labelKey('template'), controlName: 'template', type: 'textarea', rows: 3, disabled: true },
    { label: labelKey('autoCommentId'), controlName: 'autoCommentId', type: 'select', options: [] },
    { label: labelKey('autoComment'), controlName: 'autoComment', type: 'textarea', rows: 3, disabled: true },
    { label: labelKey('comment'), controlName: 'comment', type: 'textarea', rows: 3 },
  ];
  data = {};
  nodes: ITreeNode[];

  private debtorId = 1;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this.userTemplatesService.getTemplates(4, 0)
      .map(valuesToOptions)
      .subscribe(autoCommentId => {
        this.controls.find(control => control.controlName === 'autoCommentId').options = autoCommentId;
        this.cdRef.markForCheck();
      });
    this.fetchNodes();
  }

  ngAfterViewInit(): void {
    // TODO(d.maltsev): subscription
    this.form.onCtrlValueChange('autoCommentId')
      .flatMap(([{ value }]) => {
        return this.contactRegistrationService
          .fetchAutoComment(this.debtId, this.debtorId, 1, value)
          .catch(() => Observable.of(null));
      })
      .filter(Boolean)
      .subscribe(autoComment => this.updateData('autoComment', autoComment));

    // TODO(d.maltsev): subscription
    this.selectedNode$
      .filter(selectedNode => selectedNode && isEmpty(selectedNode.children))
      .flatMap(selectedNode => {
        return this.contactRegistrationService
          .fetchScenario(this.debtId, this.contactTypeCode, selectedNode.id)
          .catch(() => Observable.of(null));
      })
      .filter(Boolean)
      .subscribe(template => this.updateData('template', template));
  }

  onNodeSelect(event: { node: ITreeNode }): void {
    this.selectedNode$.next(event.node);
  }

  get selectedNode$(): BehaviorSubject<ITreeNode> {
    return this.contactRegistrationService.selectedNode$;
  }

  private updateData(key: string, value: any): void {
    this.data = {
      ...this.data,
      [key]: value,
    };
    this.cdRef.markForCheck();
  }

  private fetchNodes(): void {
    this.contactRegistrationService.fetchContactTree(this.debtId, this.contactTypeCode).subscribe(nodes => {
      this.nodes = nodes;
      this.cdRef.markForCheck();
    });
  }
}
