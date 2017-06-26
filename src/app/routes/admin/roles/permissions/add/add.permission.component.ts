import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { ValueConverterService } from '../../../../../core/converter/value/value-converter.service';

import { IPermissionModel, IPermissionRole, IPermissionsResponse } from '../../permissions.interface';
import { IDataSource } from '../../../../../shared/components/grid/grid.interface';

import { GridComponent } from '../../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add.permission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddPermissionComponent implements AfterViewInit {

  @ViewChild(GridComponent) addPermitGrid: GridComponent;
  @Input() currentRole = null as IPermissionRole;
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
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

  constructor(private valueConverterService: ValueConverterService) { }

  parseFn = (data: IPermissionsResponse) => this.valueConverterService.deserializeSet(data.permits);

  ngAfterViewInit(): void {
    this.addPermitGrid.load(this.currentRole).take(1).subscribe();
  }

  onSelectPermissions(): void {
    this.selectedPermissions = this.addPermitGrid.selected;
  }

  onCancel(): void {
    this.cancel.emit();
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
    return this.selectedPermissions && !!this.selectedPermissions.length;
  }
}
