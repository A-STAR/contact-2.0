import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IGridSelectFilterType } from '@app/shared/components/form/dropdown/grid-select/grid-select.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { GridSelectService } from './grid-select.service';

@Component({
  selector: 'app-grid-select',
  templateUrl: './grid-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GridSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridSelectComponent<T> implements OnInit, ControlValueAccessor {
  @Input() controlDisabled: boolean;
  @Input() filterParams: any = {};
  @Input() filterType: IGridSelectFilterType;
  @Input() label: string;
  @Input() required: boolean;

  @Output() select = new EventEmitter<T>();

  rows: T[];
  selection: number;
  gridColumns: ISimpleGridColumn<T>[];
  labelGetter: Function;
  valueGetter: Function;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridSelectService: GridSelectService,
  ) { }

  ngOnInit(): void {

    this.labelGetter = this.gridSelectService.getLabelGetter(this.filterType);
    this.valueGetter = this.gridSelectService.getValueGetter(this.filterType);
    this.gridColumns = this.gridSelectService.getGridColumns(this.filterType);

    this.fetch(this.filterParams)
      .subscribe(rows => {
        this.rows = rows;
        this.cdRef.markForCheck();
    });
  }

  writeValue(value: number): void {
    this.selection = value;
    this.cdRef.markForCheck();
  }

  fetch(filterParams: any): Observable<T[]> {
    return this.gridSelectService.getFetchCallback(this.filterType)(filterParams);
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  onChange(value: number): void {
    this.propagateChange(value);
  }

  onSelect(row: T): void {
    this.select.emit(row);
  }

  registerOnTouched(): void {
  }

  private propagateChange: Function = () => {};

}
