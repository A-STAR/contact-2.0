import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ExcelFilterService } from '../excel-filter.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GridControlComponent),
    }
  ],
  selector: 'app-action-grid-excel-filter-guid-control',
  templateUrl: 'guid-control.component.html'
})
export class GridControlComponent implements OnInit, ControlValueAccessor {
  @Input() columns: any[] = [];

  @Output() remove = new EventEmitter<void>();

  @ViewChild('file') file: ElementRef;

  columnOptions = [];

  total: number;

  private columnId: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private excelFilterService: ExcelFilterService,
  ) {}

  ngOnInit(): void {
    this.columnOptions = this.columns.map(column => ({
      label: column.label,
      value: column.colId,
    }));
  }

  writeValue(): void {
    //
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  onColumnSelect(columnId: any): void {
    this.columnId = columnId;
  }

  onUpload(): void {
    const file = (this.file.nativeElement as HTMLInputElement).files[0];
    const typeCode = this.columns.find(c => c.colId === this.columnId).dataType;
    this.excelFilterService
      .uploadExcel(file, typeCode)
      .subscribe(response => {
        const { guid, total } = response;
        this.propagateChange({ guid, columnId: this.columnId });
        this.total = total;
        this.cdRef.markForCheck();
      });
  }

  onRemove(): void {
    this.remove.emit();
  }

  onFocusOut(): void {
    this.propagateTouch();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
