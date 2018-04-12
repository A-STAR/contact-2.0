import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ExcelFilterService } from './excel-filter.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-excel-filter',
  templateUrl: 'excel-filter.component.html'
})
export class ExcelFilterComponent implements OnInit {
  @Input() columns: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  @ViewChild('file') file: ElementRef;

  columnOptions = [];

  private columnId: string;

  constructor(
    private excelFilterService: ExcelFilterService,
  ) {}

  ngOnInit(): void {
    this.columnOptions = this.columns.map(column => ({
      label: column.label,
      value: column.colId,
    }));
  }

  onColumnSelect(columnId: any): void {
    this.columnId = columnId;
  }

  onSubmit(): void {
    const file = (this.file.nativeElement as HTMLInputElement).files[0];
    const typeCode = this.columns.find(c => c.colId === this.columnId).dataType;
    this.excelFilterService.uploadExcel(file, typeCode).subscribe(console.log);
    // this.submit.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
