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
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

import { ExcelFilterService } from '../excel-filter.service';

enum GuidControlState {
  NO_FILE            = 'no-file',
  HAS_FILE_TO_UPLOAD = 'has-file-to-upload',
  READY              = 'ready',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GuidControlComponent),
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GuidControlComponent),
    }
  ],
  selector: 'app-action-grid-excel-filter-guid-control',
  templateUrl: 'guid-control.component.html'
})
export class GuidControlComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() columns: any[] = [];

  @Output() remove = new EventEmitter<void>();

  @ViewChild('file') file: ElementRef;

  columnOptions = [];
  state = GuidControlState.NO_FILE;
  total: number;

  private columnId: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private excelFilterService: ExcelFilterService,
  ) {}

  get hasFileToUpload(): boolean {
    return this.state === GuidControlState.HAS_FILE_TO_UPLOAD;
  }

  get ready(): boolean {
    return this.state === GuidControlState.READY;
  }

  ngOnInit(): void {
    this.columnOptions = this.columns.map(column => ({
      label: column.label,
      value: column.colId,
    }));
  }

  validate(): any {
    return this.total
      ? null
      : { required: true };
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

  onFileChange(): void {
    this.state = GuidControlState.HAS_FILE_TO_UPLOAD;
    this.cdRef.markForCheck();
  }

  onUpload(): void {
    const file = (this.file.nativeElement as HTMLInputElement).files[0];
    const typeCode = this.columns.find(c => c.colId === this.columnId).dataType;
    this.excelFilterService
      .uploadExcel(file, typeCode)
      .subscribe(response => {
        const { guid, total } = response;
        this.total = total;
        this.state = GuidControlState.READY;
        this.propagateChange({ guid, columnId: this.columnId });
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
