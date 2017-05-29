import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ValueConverterService } from '../../../../../core/converter/value/value-converter.service';

import { GridComponent } from '../../../../../shared/components/grid/grid.component';
import { IDisplayProperties } from '../../roles.interface';
import { IPermissionModel, IPermissionRole, IPermissionsResponse } from '../permissions.interface';
import { IDataSource } from '../../../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add.permission.component.html'
})
export class AddPermissionComponent implements AfterViewInit {

  @ViewChild('addPermitGrid') addPermitGrid: GridComponent;
  @Input() displayProperties: IDisplayProperties;
  @Input() currentRole: IPermissionRole;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() add: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  private selectedPermissions: IPermissionModel[];

  columns: Array<any> = [
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'dsc', minWidth: 70 },
  ];

  public dataSource: IDataSource = {
    read: '/api/roles/{id}/permits/notadded',
    dataKey: 'permits'
  };

  constructor(private valueConverterService: ValueConverterService) {
  }

  parseFn = (data: IPermissionsResponse) => this.valueConverterService.deserializeSet(data.permits);

  /**
   * @template
   */
  public ngAfterViewInit(): void {
    this.addPermitGrid.load(this.currentRole).subscribe();
  }

  onSelectPermissions(permissions: IPermissionModel[]): void {
    this.selectedPermissions = permissions;
  }

  onCancel(): void {
    this.cancel.emit(false);
  }

  onDisplayChange(event: boolean): void {
    if (!event) {
      this.onCancel();
    }
  }

  onAddPermissions(): void {
    this.add.emit(this.selectedPermissions);
  }

  canAddPermissions(): boolean {
    return this.selectedPermissions && this.selectedPermissions.length > 0;
  }
}