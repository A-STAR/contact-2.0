import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-toolbar',
  styleUrls: [ './toolbar.component.scss' ],
  templateUrl: './toolbar.component.html'
})
export class GridToolbarComponent implements OnInit {
  @Input() gridApi: GridApi;
  @Input() pagination = false;

  pageSizeOptions = [ 100, 250, 500, 1000 ].map(value => ({ value, label: String(value) }));

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.gridApi.paginationSetPageSize(100);
  }

  get selectedRows(): number {
    return this.gridApi.getSelectedRows().length;
  }

  get totalRows(): number {
    // Here 'displayed' means not filtered.
    // This method actually returns number of rows across all pages.
    return this.gridApi.getDisplayedRowCount();
  }

  get currentPage(): number {
    return this.gridApi.paginationGetCurrentPage() + 1;
  }

  get totalPages(): number {
    return this.gridApi.paginationGetTotalPages();
  }

  get pageSize(): number {
    return this.gridApi.paginationGetPageSize();
  }

  onFirstPageClick(): void {
    this.gridApi.paginationGoToFirstPage();
    this.cdRef.markForCheck();
  }

  onPreviousPageClick(): void {
    this.gridApi.paginationGoToPreviousPage();
    this.cdRef.markForCheck();
  }

  onNextPageClick(): void {
    this.gridApi.paginationGoToNextPage();
    this.cdRef.markForCheck();
  }

  onLastPageClick(): void {
    this.gridApi.paginationGoToLastPage();
    this.cdRef.markForCheck();
  }

  onPageSizeChange(pageSize: number): void {
    this.gridApi.paginationSetPageSize(pageSize);
    this.cdRef.markForCheck();
  }

  update(): void {
    this.cdRef.markForCheck();
  }
}
