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

enum IGuidControlState {
  NO_FILE            = 'no-file',
  HAS_FILE_TO_UPLOAD = 'has-file-to-upload',
  READY              = 'ready',
}

interface IGuidControlValue {
  columnId: string;
  fileName: string;
  guid: string;
  total: number;
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

  private state = IGuidControlState.NO_FILE;

  private value: IGuidControlValue;

  constructor(
    private cdRef: ChangeDetectorRef,
    private excelFilterService: ExcelFilterService,
  ) {}

  get hasFileToUpload(): boolean {
    return this.state === IGuidControlState.HAS_FILE_TO_UPLOAD;
  }

  get ready(): boolean {
    return this.state === IGuidControlState.READY;
  }

  get selectedColumn(): string {
    return this.value && this.value.columnId;
  }

  get total(): number {
    return this.value && this.value.total;
  }

  ngOnInit(): void {
    this.columnOptions = this.columns.map(column => ({
      label: column.label,
      value: column.colId,
    }));
  }

  validate(): any {
    return this.value && this.value.total
      ? null
      : { required: true };
  }

  writeValue(value: IGuidControlValue): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  onColumnSelect(columnId: any): void {
    this.value = { ...this.value, columnId };
  }

  onFileChange(): void {
    // TODO: save file name
    this.state = IGuidControlState.HAS_FILE_TO_UPLOAD;
    this.cdRef.markForCheck();
  }

  onUpload(): void {
    const file = (this.file.nativeElement as HTMLInputElement).files[0];
    const typeCode = this.columns.find(c => c.colId === this.value.columnId).dataType;
    this.excelFilterService
      .uploadExcel(file, typeCode)
      .subscribe(response => {
        const { guid, total } = response;
        this.value = {
          ...this.value,
          guid,
          total,
        };
        this.state = IGuidControlState.READY;
        this.propagateChange(this.value);
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
