import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../../../core/auth/auth.service';
import { IDynamicFormControl } from '../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IRoleEditForm } from './roles.interface';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html'
})
export class RolesEditComponent implements OnChanges {
  @Input() role: IRoleEditForm;
  @Output() roleChange: EventEmitter<IRoleEditForm> = new EventEmitter();

  form: FormGroup;

  controls: Array<IDynamicFormControl> = [
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

  constructor(private authHttp: AuthHttp, private authService: AuthService, private formBuilder: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const role = changes.role.currentValue;
    this.form = role ? this.createForm(role) : null;
  }

  onDisplayChange(event) {
    if (event === false) {
      this.close();
    }
  }

  onSaveClick() {
    this.rootUrl().then(baseUrl => {
      this.httpAction(baseUrl)
        .toPromise()
        .then(data => {
          if (data.ok) {
            // TODO: check success === true in data.json()
            // TODO: reload grid
            this.close();
          }
        })
        .catch(error => {
          // TODO: error handling
          console.log(error);
        });
    });
  }

  onCancelClick() {
    this.close();
  }

  get popupTitle() {
    return this.isUpdating() ? this.role.name : 'Новая роль';
  }

  private isUpdating() {
    return this.role && this.role.name;
  }

  private close() {
    this.role = null;
    this.roleChange.emit(null);
  }

  private createForm(role: IRoleEditForm) {
    return this.formBuilder.group({
      name: [ this.role.name, Validators.required ],
      comment: [ this.role.comment, Validators.required ],
    });
  }

  private rootUrl(): Promise<string> {
    return this.authService.getRootUrl().then(url => url);
  }

  private httpAction(baseUrl: string) {
    return this.isUpdating() ?
      this.httpActionUpdate(baseUrl) :
      this.httpActionCreate(baseUrl);
  }

  private httpActionCreate(baseUrl: string) {
    return this.authHttp.post(`${baseUrl}/api/roles/`, this.form.getRawValue());
  }

  private httpActionUpdate(baseUrl: string) {
    return this.authHttp.put(`${baseUrl}/api/roles/${this.role.id}`, this.form.getRawValue());
  }
}
