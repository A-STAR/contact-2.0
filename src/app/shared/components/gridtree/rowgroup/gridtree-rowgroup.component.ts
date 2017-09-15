import { Component, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

import { GridTreeService } from '../gridtree.service';

@Component({
  selector: 'app-gridtree-rowgroup',
  templateUrl: './gridtree-rowgroup.component.html',
  styleUrls: [ './gridtree-rowgroup.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeRowGroupComponent<T> implements OnInit {
  @HostBinding('attr.draggable') draggable = true;

  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() nestingLevel = 0;
  @Input() row = null as IGridTreeRow<T>;

  private _isDragged = false;
  private _isDraggedOver = false;
  private _isDraggedOverDivider = false;
  private _isSelected = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>,
  ) {}

  ngOnInit(): void {
    this.gridTreeService.drop
      .subscribe(() => {
        this._isDragged = false;
        this._isDraggedOver = false;
        this._isDraggedOverDivider = false;
        this.cdRef.markForCheck();
      });

    this.gridTreeService.select
      .startWith(this.gridTreeService.selectedRow)
      .subscribe((row: IGridTreeRow<T>) => {
        this._isSelected = row && row.data['id'] === this.row.data['id'];
        this.cdRef.markForCheck();
      });
  }

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }

  get rowClass(): object {
    return {
      'is-dragged': this._isDragged,
      'is-dragged-over': this._isDraggedOver,
      'is-selected': this._isSelected,
    };
  }

  get dividerClass(): object {
    return {
      'divider': true,
      'is-dragged-over': this._isDraggedOverDivider
    };
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): void {
    event.stopPropagation();
    this._isDragged = true;
    this.gridTreeService.onDragStart(event, this.row);
    this.cdRef.markForCheck();
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent): void {
    event.stopPropagation();
    this._isDragged = false;
    this.cdRef.markForCheck();
  }

  onDrop(event: DragEvent): void {
    event.stopPropagation();
    this.gridTreeService.onDrop(event, this.row);
    this.cdRef.markForCheck();
  }

  onDragOver(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragEnter(event: DragEvent): void {
    event.stopPropagation();
    this._isDraggedOver = true;
    this._isDraggedOverDivider = false;
    this.cdRef.markForCheck();
  }

  onDragLeave(event: DragEvent): void {
    event.stopPropagation();
    this._isDraggedOver = false;
    this.cdRef.markForCheck();
  }

  onDividerDrop(event: DragEvent): void {
    event.stopPropagation();
    this.gridTreeService.onDividerDrop(event, this.row);
    this.cdRef.markForCheck();
  }

  onDividerDragOver(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  onDividerDragEnter(event: DragEvent): void {
    event.stopPropagation();
    this._isDraggedOver = false;
    this._isDraggedOverDivider = true;
    this.cdRef.markForCheck();
  }

  onDividerDragLeave(event: DragEvent): void {
    event.stopPropagation();
    this._isDraggedOverDivider = false;
    this.cdRef.markForCheck();
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.row.isExpanded = !this.row.isExpanded;
    this.cdRef.markForCheck();
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.gridTreeService.onSelect(this.row);
  }

  onDoubleClick(event: MouseEvent): void {
    event.stopPropagation();
    this.gridTreeService.onDoubleClick(this.row);
  }
}
