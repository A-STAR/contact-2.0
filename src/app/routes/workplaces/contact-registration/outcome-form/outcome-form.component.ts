import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';

import { IContactTreeNode } from '../../../../shared/gui-objects/widgets/contact-property/contact-property.interface';
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
      .flatMap(([{ value }]) => this.contactRegistrationService.fetchAutoComment(this.debtId, this.debtorId, 1, value))
      .subscribe(autoComment => this.updateData('autoComment', autoComment));

    // TODO(d.maltsev): subscription
    this.selectedNode$
      .filter(selectedNode => selectedNode && isEmpty(selectedNode.children))
      .flatMap(selectedNode => this.contactRegistrationService.fetchScenario(this.debtId, this.contactTypeCode, selectedNode.id))
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

  // TODO(d.maltsev): make a helper for this
  private fetchNodes(): void {
    this.contactRegistrationService.fetchContactTree(this.debtId, this.contactTypeCode).subscribe(nodes => {
      const root = { id: 0 };
      this.nodes = this.addParents([
        {
          ...root,
          children: this.convertToTreeNodes(nodes)
        }
      ]);
      this.cdRef.markForCheck();
    });
  }

  // TODO(d.maltsev): make a helper for this
  private convertToTreeNodes(nodes: IContactTreeNode[]): ITreeNode[] {
    return nodes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(node => {
        const { children, sortOrder, ...data } = node;
        return {
          data,
          ...(!isEmpty(children) ? { children: this.convertToTreeNodes(children) } : {}),
          sortOrder,
          label: node.name || `Node #${node.id}`,
          bgColor: node.boxColor,
          id: node.id,
          expanded: false,
        };
      });
  }

  // TODO(d.maltsev): make a helper for this
  private addParents(nodes: ITreeNode[], parent: ITreeNode = null): ITreeNode[] {
    return nodes.map(node => {
      const { children } = node;
      return {
        ...node,
        ...(!isEmpty(children) ? { children: this.addParents(children, node) } : {}),
        parent,
      };
    });
  }
}
