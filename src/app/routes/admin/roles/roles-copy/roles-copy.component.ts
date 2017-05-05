import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../../../../core/auth/auth.service';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends AbstractRolesPopup {
  @Input() originalRole: IRoleRecord = null;

  controls: Array<IDynamicFormControl> = [
    {
      label: 'Название оригинальной роли',
      controlName: 'originalName',
      type: 'text',
      required: true
    },
    {
      label: 'Название',
      controlName: 'name',
      type: 'text',
      required: true
    },
    {
      label: 'Комментарий',
      controlName: 'comment',
      type: 'textarea',
      required: true,
      rows: 2
    },
  ];

  constructor(protected authHttp: AuthHttp, protected authService: AuthService, private formBuilder: FormBuilder) {
    super();
  }

  protected createForm(role: IRoleRecord) {
    return this.formBuilder.group({
      originalName: [ this.originalRole.name, Validators.required ],
      name: [ this.role.name, Validators.required ],
      comment: [ this.role.comment, Validators.required ],
    });
  }

  protected httpAction(baseUrl: string) {
    return this.authHttp.post(`${baseUrl}/api/roles/`, this.form.getRawValue());
  }
}
