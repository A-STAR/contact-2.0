import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ValueConverterService } from '../../../../../core/converter/value/value-converter.service';

import { GridComponent } from '../../../../../shared/components/grid/grid.component';
import { IDisplayProperties } from '../../roles.interface';
import {IPermissionModel, IPermissionRole, IPermissionsResponse} from '../permissions.interface';
import {IDataSource} from '../../../../../shared/components/grid/grid.interface';

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
    {name: 'Название', prop: 'name', minWidth: 200, maxWidth: 350},
    {name: 'Описание', prop: 'dsc', minWidth: 70},
  ];

  public dataSource: IDataSource = {
    read: '/api/roles/{id}/permits/notadded',
    dataKey: 'permits'
  };

  constructor(private valueConverterService: ValueConverterService) {
  }

  public parseFn(data: IPermissionsResponse) {
    return this.valueConverterService.deserializeSet(data.permits);
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
