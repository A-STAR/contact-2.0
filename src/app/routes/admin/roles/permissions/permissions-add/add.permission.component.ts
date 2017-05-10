import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { BasePermissionsComponent } from '../base.permissions.component';
import { GridComponent } from '../../../../../shared/components/grid/grid.component';
import { IDisplayProperties } from '../../roles.interface';
import { IPermissionModel, IPermissionRole } from '../permissions.interface';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add.permission.component.html'
})
export class AddPermissionComponent extends BasePermissionsComponent implements AfterViewInit {

  @ViewChild('addPermitGrid') addPermitGrid: GridComponent;
  @Input() displayProperties: IDisplayProperties;
  @Input() currentRole: IPermissionRole;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() add: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  private selectedPermissions: IPermissionModel[];

  columns: Array<any> = [
    {name: 'Название', prop: 'name', minWidth: 200, maxWidth: 350},
    {name: 'Описание', prop: 'dsc', minWidth: 70},
  ];

  constructor() {
    super({
      read: '/api/roles/{id}/permits/notadded',
      dataKey: 'permits',
    });
  }

  /**
   * @template
   */
  public ngAfterViewInit(): void {
    this.addPermitGrid.load(this.currentRole);
  }

  onSelectPermissions(permissions: IPermissionModel[]): void {
    this.selectedPermissions = permissions;
  }

  onCancel(): void {
    this.cancel.emit(false);
  }

  onAddPermissions(): void {
    this.add.emit(this.selectedPermissions);
  }

  canAddPermissions(): boolean {
    return this.selectedPermissions && this.selectedPermissions.length > 0;
  }
}
