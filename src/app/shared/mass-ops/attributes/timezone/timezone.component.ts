import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { ILookupTimeZone } from '@app/core/lookup/lookup.interface';
import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { AttributesService } from '../attributes.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-mass-attr-timezone',
  templateUrl: './timezone.component.html',
  styleUrls: ['./timezone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimezoneComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedTimeZone: ILookupTimeZone;

  columns: ISimpleGridColumn<ILookupTimeZone>[] = [
    { prop: 'code' },
    { prop: 'name' },
    { prop: 'utcOffset' },
  ].map(addGridLabel('widgets.mass.changeTimezoneAttr.grid'));

  timeZones: ILookupTimeZone[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this.attributesService.getTimezones()
      .subscribe(timeZones => {
        this.timeZones = timeZones;
        this.cdRef.markForCheck();
      });
  }

  submit(): void {
    this.attributesService
      .change(this.actionData.payload, { timeZoneId: this.selectedTimeZone.id })
      .subscribe(() => {
        // const refresh = res.massInfo && !!res.massInfo.processed;
        // this.close.emit({ refresh });
        this.close.emit({ refresh: false });
      });
  }

  get canSubmit(): boolean {
    return !!this.selectedTimeZone;
  }

  onSelect(timeZones: ILookupTimeZone[]): void {
    this.selectedTimeZone = timeZones[0];
  }

  cancel(): void {
    this.close.emit();
  }

}
