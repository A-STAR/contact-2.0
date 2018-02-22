import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';
import { IObject } from '../../contractor-objects.interface';

import { ContractorObjectsService } from '../../contractor-objects.service';

import { GridComponent } from '../../../../../components/grid/grid.component';

@Component({
  selector: 'app-contractor-objects-grid-add',
  templateUrl: './contractor-objects-grid-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractorObjectsGridAddComponent implements OnInit {
  @Input() contractorId: number;
  @Input() typeCode: number;

  @Output() submit = new EventEmitter<number[]>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(GridComponent) grid: GridComponent;

  columns: IGridColumn[] = [
    { prop: 'id' },
    { prop: 'name' },
  ];

  rows: IObject[] = [];

  private _hasSelection = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorObjectsService: ContractorObjectsService,
  ) {}

  ngOnInit(): void {
    this.contractorObjectsService.fetchNotAdded(this.contractorId, this.typeCode).subscribe(objects => {
      this.rows = objects;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this._hasSelection;
  }

  onSelect(): void {
    this._hasSelection = true;
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    const ids = this.grid.selected.map(item => item.id);
    this.submit.emit(ids);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
