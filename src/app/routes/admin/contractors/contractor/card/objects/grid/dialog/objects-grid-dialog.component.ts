import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { IObject } from '../../objects.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ObjectsService } from '../../objects.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-objects-grid-dialog',
  templateUrl: './objects-grid-dialog.component.html',
  styleUrls: ['./objects-grid-dialog.component.scss'],
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectsGridDialogComponent implements OnInit {
  @Input() contractorId: number;
  @Input() typeCode: number;

  @Output() submit = new EventEmitter<number[]>();
  @Output() cancel = new EventEmitter<void>();

  columns: Array<ISimpleGridColumn<IObject>>[] = [
    { prop: 'id' },
    { prop: 'name' },
  ].map(addGridLabel('widgets.contractorObject.grid'));

  rows: IObject[] = [];
  private selection: IObject[];

  private _hasSelection = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private objectsService: ObjectsService,
  ) {}

  ngOnInit(): void {
    this.objectsService.fetchNotAdded(this.contractorId, this.typeCode).subscribe(objects => {
      this.rows = objects;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this._hasSelection;
  }

  onSelect(objects: IObject[]): void {
    this._hasSelection = true;
    this.selection = objects;
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    const ids = this.selection.map(item => item.id);
    this.submit.emit(ids);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
