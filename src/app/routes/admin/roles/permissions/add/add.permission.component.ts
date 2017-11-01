import { Component, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { IPermissionModel } from '../../permissions.interface';

import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { GridComponent } from '../../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add.permission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddPermissionComponent {
  @ViewChild(GridComponent) addPermitGrid: GridComponent;

  @Input() availablePermissions: IPermissionModel[];
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @Output() add: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  private selectedPermissions: IPermissionModel[];

  columns: Array<any> = [
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'dsc', minWidth: 70 },
  ];

  constructor(private valueConverterService: ValueConverterService) { }

  parseFn = (permits: IPermissionModel[]) => this.valueConverterService.deserializeSet(permits);

  onSelectPermissions(): void {
    this.selectedPermissions = this.addPermitGrid.selected;
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
