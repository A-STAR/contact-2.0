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

import { IObject } from '../objects.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ObjectsService } from '../objects.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { addGridLabel } from '@app/core/utils';

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

  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IObject>;

  columns: ISimpleGridColumn<IObject>[] = [
    { prop: 'id' },
    { prop: 'name' },
  ].map(addGridLabel('widgets.object.grid'));

  rows: IObject[] = [];

  private _hasSelection = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private objectsService: ObjectsService,
  ) {}

  ngOnInit(): void {
    this.objectsService.fetchNotAdded(this.roleId, this.typeCode).subscribe(objects => {
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
    const ids = this.grid.selection.map(item => item.id);
    this.submit.emit(ids);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
