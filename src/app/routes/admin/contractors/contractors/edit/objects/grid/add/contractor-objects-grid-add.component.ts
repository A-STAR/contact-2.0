import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { IObject } from '../../contractor-objects.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ContractorObjectsService } from '../../contractor-objects.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-contractor-objects-grid-add',
  templateUrl: './contractor-objects-grid-add.component.html',
  styleUrls: ['./contractor-objects-grid-add.component.scss'],
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractorObjectsGridAddComponent implements OnInit {
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
