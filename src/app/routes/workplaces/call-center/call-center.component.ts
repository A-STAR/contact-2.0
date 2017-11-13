import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICampaign } from './call-center.interface';
import { IGridColumn } from '../../../shared/components/grid/grid.interface';

import { CallCenterService } from './call-center.service';

import { GridComponent } from '../../../shared/components/grid/grid.component';

import { isEmpty } from '../../../core/utils';

@Component({
  selector: 'app-call-center',
  templateUrl: 'call-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CallCenterService,
  ]
})
export class CallCenterComponent {
  static COMPONENT_NAME = 'CallCenterComponent';

  @ViewChild(GridComponent) grid: GridComponent;

  columns: IGridColumn[] = [
    { prop: 'name' },
    { prop: 'comment' },
  ];

  constructor(
    private callCenterService: CallCenterService,
    private cdRef: ChangeDetectorRef,
  ) {}

  get isSubmitButtonDisabled(): boolean {
    return isEmpty(this.selection);
  }

  get campaigns$(): Observable<ICampaign[]> {
    return this.callCenterService.campaigns$;
  }

  onAction(campaign: ICampaign): void {
    this.callCenterService.navigateToCampaign(campaign);
  }

  onSelect(): void {
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    if (!isEmpty(this.selection)) {
      this.callCenterService.navigateToCampaign(this.selection[0]);
    }
  }

  private get selection(): ICampaign[] {
    return this.grid.selected;
  }
}
