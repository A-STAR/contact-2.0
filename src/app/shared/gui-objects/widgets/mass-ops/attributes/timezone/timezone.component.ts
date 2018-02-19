import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { ILookupTimeZone } from '../../../../../../core/lookup/lookup.interface';
import { ICloseAction, IGridAction } from '../../../../../components/action-grid/action-grid.interface';
import { IGridColumn } from '../../../../../components/grid/grid.interface';

import { AttributesService } from '../attributes.service';
import { GridService } from '../../../../../components/grid/grid.service';

@Component({
  selector: 'app-mass-attr-timezone',
  templateUrl: './timezone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimezoneComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedTimeZone: ILookupTimeZone;

  columns: IGridColumn[] = [
    { prop: 'code' },
    { prop: 'name' },
    { prop: 'utcOffset' },
  ];

  timeZones: ILookupTimeZone[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService
  ) { }

  ngOnInit(): void {

    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.attributesService.getTimezones()
      .subscribe(timeZones => {
        this.timeZones = timeZones;
        this.cdRef.markForCheck();
      });
  }

  submit(): void {
    this.attributesService
      .change(this.actionData.payload, { timeZoneId: this.selectedTimeZone.id })
      .subscribe((res) => {
        const refresh = res.massInfo && !!res.massInfo.processed;
        this.close.emit({ refresh });
      });
  }

  get canSubmit(): boolean {
    return !!this.selectedTimeZone;
  }

  onSelect(timeZone: ILookupTimeZone): void {
    this.selectedTimeZone = timeZone;
  }

  cancel(): void {
    this.close.emit();
  }

}
