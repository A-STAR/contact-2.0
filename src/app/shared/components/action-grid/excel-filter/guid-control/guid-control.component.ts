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

export enum GuidControlState {
  NO_FILE            = 'no-file',
  HAS_FILE_TO_UPLOAD = 'has-file-to-upload',
  READY              = 'ready',
}

export interface IGuidControlValue {
  columnId: string;
  fileName: string;
  guid: string;
  state: GuidControlState;
  total: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GuidControlComponent),
    }
  ],
  selector: 'app-action-grid-excel-filter-guid-control',
  templateUrl: 'guid-control.component.html'
})
export class GuidControlComponent implements OnInit, ControlValueAccessor {
  @Input() columns: any[] = [];

  @Output() remove = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput: ElementRef;

  columnOptions = [];

  private value: IGuidControlValue = {
    columnId: null,
    fileName: null,
    guid: null,
    state: GuidControlState.NO_FILE,
    total: null,
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private excelFilterService: ExcelFilterService,
  ) {}

  get fileName(): string {
    return this.value.fileName;
  }

  get hasNoFile(): boolean {
    return this.value.state === GuidControlState.NO_FILE;
  }

  get hasFileToUpload(): boolean {
    return this.value.state === GuidControlState.HAS_FILE_TO_UPLOAD;
  }

  get isReady(): boolean {
    return this.value.state === GuidControlState.READY;
  }

  get selectedColumn(): string {
    return this.value.columnId;
  }

  get total(): number {
    return this.value.total;
  }

  ngOnInit(): void {
    this.columnOptions = this.columns.map(column => ({
      label: column.label,
      value: column.colId,
    }));
  }

  writeValue(value: IGuidControlValue): void {
    this.updateValue(value || {}, false);
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  onColumnSelect(columnId: any): void {
    this.updateValue({ columnId });
  }

  onFileChange(): void {
    this.updateValue({
      fileName: this.file.name,
      state: GuidControlState.HAS_FILE_TO_UPLOAD,
    });
    this.upload();
  }

  onRemove(): void {
    this.remove.emit();
  }

  onFocusOut(): void {
    this.propagateTouch();
  }

  private upload(): void {
    const typeCode = this.columns.find(c => c.colId === this.value.columnId).dataType;
    this.excelFilterService
      .uploadExcel(this.file, typeCode)
      .subscribe(response => {
        const { guid, total } = response;
        this.updateValue({
          guid,
          total,
          state: GuidControlState.READY,
        });
      });
  }

  private updateValue(value: Partial<IGuidControlValue>, propagate: boolean = true): void {
    this.value = {
      ...this.value,
      ...value,
    };
    if (propagate) {
      this.propagateChange(this.value);
    }
    this.cdRef.markForCheck();
  }

  private get file(): File {
    return (this.fileInput.nativeElement as HTMLInputElement).files[0];
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
