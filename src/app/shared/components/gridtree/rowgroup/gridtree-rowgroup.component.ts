import { Component, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, HostListener, Input } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow } from '../gridtree.interface';

import { GridTreeService } from '../gridtree.service';

@Component({
  selector: 'app-gridtree-rowgroup',
  templateUrl: './gridtree-rowgroup.component.html',
  styleUrls: [ './gridtree-rowgroup.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeRowGroupComponent<T> {
  @HostBinding('attr.draggable') draggable = true;

  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() nestingLevel = 0;
  @Input() row: IGridTreeRow<T>;

  private _isDragged = false;
  private _isDraggedOver = false;
  private _isExpanded = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTreeService: GridTreeService<T>,
  ) {
    this.gridTreeService.drop.subscribe(() => {
      this._isDragged = false;
      this._isDraggedOver = false;
      this.cdRef.markForCheck();
    });
  }

  get hasChildren(): boolean {
    return this.row.children && this.row.children.length > 0;
  }

  get isDragged(): boolean {
    return this._isDragged;
  }

  get isDraggedOver(): boolean {
    return this._isDraggedOver;
  }

  get isExpanded(): boolean {
    return this._isExpanded;
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
    this.cdRef.markForCheck();
  }

  onDragLeave(event: DragEvent): void {
    event.stopPropagation();
    this._isDraggedOver = false;
    this.cdRef.markForCheck();
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this._isExpanded = !this._isExpanded;
    this.cdRef.markForCheck();
  }
}
