import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl, IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ILabeledValue } from '../../../../../core/converter/value-converter.interface';
import { IPermissionRole } from '../../permissions.interface';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { PermissionsService } from '../../permissions.service';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent implements OnInit, OnDestroy {
  @Input() mode: string;
  @Input() title: string;
  @Input() role: IPermissionRole;

  @Output() submit = new EventEmitter<IPermissionRole>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;

  private roles: ILabeledValue[];
  private rolesSubscription: Subscription;

  constructor(private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.rolesSubscription = this.permissionsService.roles
      .subscribe((rolesList: IPermissionRole[]) => {
        this.roles = rolesList.map(role => ({ label: role.name, value: role.id }));
      });

    this.controls = this.getControls();
  }

  ngOnDestroy(): void {
    this.rolesSubscription.unsubscribe();
  }

  get formData(): any {
    return {
      originalRoleId: [{ value: this.role.id, label: this.role.name }]
    };
  }

  onSubmit(): void {
    this.submit.emit(this.form.value);
  }

  onClose(): void {
    this.close();
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  private close(): void {
    this.cancel.emit();
  }

  private getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'roles.roles.copy.originalRoleName',
        controlName: 'originalRoleId',
        type: 'select',
        required: true,
        options: this.roles,
      },
      {
        label: 'roles.roles.copy.roleName',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'roles.roles.copy.roleComment',
        controlName: 'comment',
        type: 'textarea',
        rows: 2
      },
    ];
  }
}
