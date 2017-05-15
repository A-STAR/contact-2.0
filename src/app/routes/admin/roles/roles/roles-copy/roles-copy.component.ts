import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends AbstractRolesPopup implements OnInit {
  @Input() originalRole: IRoleRecord = null;

  controls: Array<IDynamicFormControl>;

  constructor(private formBuilder: FormBuilder, private gridService: GridService) {
    super();
  }

  ngOnInit(): void {
    this.controls = [
      {
        label: 'Название оригинальной роли',
        controlName: 'originalRoleId',
        type: 'select',
        required: true,
        cachingOptions: true,
        lazyOptions: this.gridService.read('/api/roles')
          .map(
            (data: any) => data.roles.map(role => ({label: role.name, value: role.id}))
          )
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
        rows: 2
      },
    ];
  }

  protected createForm(role: IRoleRecord): FormGroup {
    return this.formBuilder.group({
      originalRoleId: [ [{ value: this.originalRole.id, label: this.originalRole.name }], Validators.required ],
      name: [ this.role.name, Validators.required ],
      comment: [ this.role.comment ],
    });
  }

  protected httpAction(): Observable<any> {
    const data = this.form.getRawValue();
    return this.gridService.create('/api/roles/{id}/copy', { id: data.originalRoleId[0].id }, data);
  }
}
