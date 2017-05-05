import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

import {BasePermissionsComponent} from './base.permissions.component';
import {GridComponent} from '../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add.permission.component.html'
})
export class AddPermissionComponent extends BasePermissionsComponent implements AfterViewInit {

  @Input() displayProperties;
  @Input() record: any;
  @ViewChild('addPermitGrid') addPermitGrid: GridComponent;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() add: EventEmitter<Array<any>> = new EventEmitter<Array<any>>(false);

  private accessiblePermissions: Array<any>;

  columns: Array<any> = [
    {name: 'Название', prop: 'name', minWidth: 200, maxWidth: 350},
    {name: 'Описание', prop: 'dsc', minWidth: 70},
  ];

  constructor() {
    super({
      read: '/api/roles/{roleId}/permits/notadded',
      dataKey: 'permits',
    });
  }

  /**
   * @template
   */
  public ngAfterViewInit(): void {
    this.addPermitGrid.load(this.record);
  }

  selectAccessiblePermissions(records: any[]) {
    this.accessiblePermissions = records;
  }

  onCancel() {
    this.cancel.emit(false);
  }

  onAddPermission() {
    this.add.emit(this.accessiblePermissions);
  }
}
