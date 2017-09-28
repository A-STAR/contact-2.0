import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';
import { IObject } from '../../object.interface';

import { ObjectService } from '../../object.service';

@Component({
  selector: 'app-object-grid-add',
  templateUrl: './object-grid-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectGridEditComponent implements OnInit {
  @Input() roleId: number;
  @Input() typeCode: number;

  @Output() submit = new EventEmitter<number[]>();
  @Output() cancel = new EventEmitter<void>();

  columns: IGridColumn[] = [
    { prop: 'id' },
    { prop: 'name' },
  ];

  rows: IObject[] = [];

  private _selectedIds: number[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private objectService: ObjectService,
  ) {}

  ngOnInit(): void {
    this.objectService.fetchNotAdded(this.roleId, this.typeCode).subscribe(objects => {
      this.rows = objects;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this._selectedIds.length > 0;
  }

  onSelect(object: IObject): void {
    this._selectedIds = [ object.id ];
  }

  onSubmit(): void {
    this.submit.emit(this._selectedIds);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
