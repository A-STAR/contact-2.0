import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { IDynamicFormControl, IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { IPermissionRole } from '../../permissions.interface';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesEditComponent implements OnInit {
  @Input() mode: string;
  @Input() role: IPermissionRole;

  @Output() submit = new EventEmitter<IPermissionRole>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.controls = this.getControls();
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    this.submit.emit(this.form.value);
  }

  onClose(): void {
    this.cancel.emit();
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get title(): string {
    return this.role ? 'roles.roles.edit.title' : 'roles.roles.create.title';
  }

  private getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'roles.roles.edit.name',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'roles.roles.edit.comment',
        controlName: 'comment',
        type: 'textarea',
      }
    ];
  }
}
