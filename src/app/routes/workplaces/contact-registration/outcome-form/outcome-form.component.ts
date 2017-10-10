import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';

import { IContactTreeNode } from '../../../../shared/gui-objects/widgets/contact-property/contact-property.interface';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { UserTemplatesService } from '../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { isEmpty, makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.outcomeForm')

@Component({
  selector: 'app-outcome-form',
  templateUrl: './outcome-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeFormComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  selectedNode$ = new BehaviorSubject<ITreeNode>(null);

  controls: IDynamicFormControl[] = [
    { label: labelKey('template'), controlName: 'template', type: 'textarea', rows: 3, disabled: true },
    { label: labelKey('autoCommentId'), controlName: 'autoCommentId', type: 'selectwrapper', lookupKey: 'currencies' },
    { label: labelKey('autoComment'), controlName: 'autoComment', type: 'textarea', rows: 3, disabled: true },
    { label: labelKey('comment'), controlName: 'comment', type: 'textarea', rows: 3 },
  ];
  data = {};
  nodes: ITreeNode[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private userTemplatesService: UserTemplatesService,
  ) {
    Observable.combineLatest(
      this.contactRegistrationService.fetchScenario(1, 1, 4),
      this.contactRegistrationService.fetchAutoComment(1, 1, 4, 1),
    ).subscribe(([ template, autoComment ]) => {
      this.data = {
        template,
        autoComment,
      };
      this.cdRef.markForCheck();
    });

    this.userTemplatesService.getTemplates(1, 1).subscribe(console.log);

    this.fetchNodes();
  }

  onNodeSelect(event: { node: ITreeNode }): void {
    this.selectedNode$.next(event.node);
  }

  // TODO(d.maltsev): make a helper for this
  private fetchNodes(): void {
    this.contactRegistrationService.fetchContactTree(1, 1).subscribe(nodes => {
      const root = { id: 0 };
      this.nodes = this.addParents([
        {
          ...root,
          children: this.convertToTreeNodes(nodes)
        }
      ]);
      // console.log(this._nodes);
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
