import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/publishReplay';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { DebtService } from '../../../../shared/gui-objects/widgets/debt/debt/debt.service';
import { UserTemplatesService } from '../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { isEmpty, makeKey, valuesToOptions } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.outcome');

@Component({
  selector: 'app-contact-registration-outcome',
  templateUrl: './outcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() debtId: number;
  @Input() contactTypeCode: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { label: labelKey('template'), controlName: 'template', type: 'textarea', rows: 3, disabled: true },
    { label: labelKey('autoCommentId'), controlName: 'autoCommentId', type: 'select', options: [], disabled: true },
    { label: labelKey('autoComment'), controlName: 'autoComment', type: 'textarea', rows: 3, disabled: true },
    { label: labelKey('comment'), controlName: 'comment', type: 'textarea', rows: 3, disabled: true },
  ];
  data = {};
  nodes: ITreeNode[];

  private autoCommentIdSubscription: Subscription;
  private selectedNodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private contactRegistrationService: ContactRegistrationService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this.getControl('template').type = [1, 2].includes(this.contactTypeCode) ? 'textarea' : 'hidden';
    this.userTemplatesService.getTemplates(4, 0)
      .map(valuesToOptions)
      .subscribe(autoCommentOptions => {
        this.getControl('autoCommentId').options = autoCommentOptions;
        this.cdRef.markForCheck();
      });
    this.fetchNodes();
  }

  ngAfterViewInit(): void {
    this.autoCommentIdSubscription = this.form.onCtrlValueChange('autoCommentId')
      .filter(Boolean)
      .flatMap(value => {
        return this.getPersonId()
          .flatMap(personId => {
            const templateId = Array.isArray(value) ? value[0].value : value;
            return this.contactRegistrationService
              .fetchAutoComment(this.debtId, personId, 1, templateId)
              .catch(() => Observable.of(null));
          });
      })
      .subscribe(autoComment => this.updateData('autoComment', autoComment));

    this.selectedNodeSubscription = this.selectedNode$
      .flatMap(selectedNode => {
        return selectedNode && isEmpty(selectedNode.children)
          ? this.contactRegistrationService
            .fetchScenario(this.debtId, this.contactTypeCode, selectedNode.id)
            .catch(() => Observable.of(null))
          : Observable.of(null);
      })
      .subscribe(template => this.updateData('template', template));
  }

  ngOnDestroy(): void {
    this.autoCommentIdSubscription.unsubscribe();
    this.selectedNodeSubscription.unsubscribe();
  }

  onNodeSelect(event: { node: ITreeNode }): void {
    const { node } = event;

    this.selectedNode$.next(node);

    if ([2, 3].includes(node.data.commentMode) && isEmpty(node.children)) {
      this.enableField('comment');
    } else {
      this.disableField('comment');
    }

    if (node.data.autoCommentIds && isEmpty(node.children)) {
      this.enableField('autoCommentId');
      this.enableField('autoComment');
    } else {
      this.disableField('autoCommentId');
      this.disableField('autoComment');
    }
  }

  get selectedNode$(): BehaviorSubject<ITreeNode> {
    return this.contactRegistrationService.selectedNode$;
  }

  private enableField(key: string): void {
    this.getControl(key).disabled = false;
  }

  private disableField(key: string): void {
    this.getControl(key).disabled = true;
    this.updateData(key, null);
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

  private getControl(name: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === name);
  }

  private getPersonId(): Observable<number> {
    return this.debtService.fetch(null, this.debtId)
      .publishReplay(1)
      .refCount()
      .map(debt => debt.personId)
      .distinctUntilChanged();
  }
}
