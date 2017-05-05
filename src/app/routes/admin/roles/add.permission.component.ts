import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { BasePermissionsComponent } from './base.permissions.component';
import { IDisplayProperties } from './permissions.interface';
import { GridComponent } from '../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add.permission.component.html'
})
export class AddPermissionComponent extends BasePermissionsComponent implements AfterViewInit {

  @Input() displayProperties: IDisplayProperties;
  @Input() record: any;
  @ViewChild('addPermitGrid') addPermitGrid: GridComponent;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() add: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  private selectedPermissions: Array<any>;

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
    this.addPermitGrid.load(this.record)
      .then((records: Array<any>) => {
        if (!records.length) {
          // TODO Temp solution. The component should be only displayed after the request has been performed
          this.displayProperties.addPermit = false;
        }
      });
  }

  onSelectPermissions(permissions: any[]) {
    this.selectedPermissions = permissions;
  }

  onCancel() {
    this.cancel.emit(false);
  }

  onAddPermissions() {
    this.add.emit(this.selectedPermissions);
  }

  canAddPermissions(): boolean {
    return this.selectedPermissions && this.selectedPermissions.length > 0;
  }
}
