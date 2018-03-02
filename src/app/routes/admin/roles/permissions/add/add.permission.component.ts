import { Component, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { IPermissionModel } from '../../permissions.interface';

import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add.permission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddPermissionComponent {
  @ViewChild(SimpleGridComponent) addPermitGrid: SimpleGridComponent<IPermissionModel>;

  @Input() availablePermissions: IPermissionModel[];
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @Output() add: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  private selectedPermissions: IPermissionModel[];

  columns: ISimpleGridColumn<IPermissionModel>[] = [
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'dsc', minWidth: 70 },
  ].map(addGridLabel('roles.permissions.add.grid'));

  constructor(private valueConverterService: ValueConverterService) { }

  // parseFn = (permits: IPermissionModel[]) => this.valueConverterService.deserializeSet(permits);

  onSelectPermissions(): void {
    this.selectedPermissions = this.addPermitGrid.selection;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onAddPermissions(): void {
    this.add.emit(this.selectedPermissions);
  }

  canAddPermissions(): boolean {
    return this.selectedPermissions && !!this.selectedPermissions.length;
  }
}
