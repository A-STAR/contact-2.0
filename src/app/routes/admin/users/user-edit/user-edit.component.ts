import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IUser } from '../users.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  @Input() user: IUser;
  @Output() userChange: EventEmitter<IUser> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  data: any;  // FIXME

  error: string = null;

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  ngOnInit(): void {
    this.controls = this.getControls();
    this.data = this.getData();
  }

  onDisplayChange(event: boolean): void {
    if (event === false) {
      this.close();
    }
  }

  onActionClick(): void {

  }

  onCancelClick(): void {
    this.close();
  }

  private getControls(): Array<IDynamicFormControl> {
    return [];
  }

  private getData(): any {
    return {};
  }

  private close(): void {
    this.user = null;
    this.userChange.emit(null);
  }
}
