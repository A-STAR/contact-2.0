import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { IContactRegistrationMode } from '../contact-registration.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-tree',
  styleUrls: [ './tree.component.scss' ],
  templateUrl: './tree.component.html',
})
export class TreeComponent {
  @Input() contactTypeCode: number;

  @Input('debtId')
  set debtId(debtId: number) {
    this._debtId = debtId;
    this.fetchNodes();
  }

  nodes = [];
  selectedNode = null;
  scenario: string = null;

  private _debtId: number;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private cdRef: ChangeDetectorRef,
    private workplacesService: WorkplacesService,
  ) {}

  get scenarioText(): string {
    // TODO(d.maltsev): i18n
    return this.selectedNode
      ? this.scenario || 'Scenario is empty:('
      : 'Select something below...';
  }

  onNodeSelect(event: any): void {
    const { node } = event;
    if (node && isEmpty(node.children)) {
      this.selectedNode = node.data;
      this.cdRef.markForCheck();
      this.fetchScenario(event.node.data.id);
    }
  }

  onNodeDoubleClick(node: any): void {
    this.contactRegistrationService.mode = IContactRegistrationMode.EDIT;
    if (node && isEmpty(node.children)) {
      this.selectedNode = node.data;
      this.contactRegistrationService.outcome = node.data;
      this.cdRef.markForCheck();
    }
  }

  private fetchNodes(): void {
    this.workplacesService
      .fetchContactTree(this._debtId, this.contactTypeCode)
      .subscribe(nodes => {
        this.nodes = nodes;
        this.cdRef.markForCheck();
      });
  }

  private fetchScenario(nodeId: number): void {
    this.workplacesService
      .fetchContactScenario(this._debtId, this.contactTypeCode, nodeId)
      .pipe(
        catchError(() => of(null)),
      )
      .subscribe(scenario => {
        this.scenario = scenario;
        this.cdRef.markForCheck();
      });
  }
}
