import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEmailSchedule } from '../../email.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-email-grid-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  @Input() debtId: number;
  @Input() emailId: number;
  @Input() personId: number;
  @Input() personRole: number;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<IEmailSchedule>();

  @ViewChild('formText') formText: FormComponent;
  @ViewChild('formTemplate') formTemplate: FormComponent;

  private tabIndex: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canSubmit(): boolean {
    return this.tabIndex === 0
      ? this.canSubmitForm(this.formText)
      : this.canSubmitForm(this.formTemplate);
  }

  get isTextTabDisabled$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_TEXT_SINGLE_FORM').map(permission => !permission);
  }

  onSubmit(): void {
    if (this.tabIndex === 0) {
      const value = this.getFormValue(this.formText);
      this.submit.emit(value);
    } else {
      const { text, ...value } = this.getFormValue(this.formTemplate);
      this.submit.emit(value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onTabSelect(tabIndex: number): void {
    this.tabIndex = tabIndex;
    this.cdRef.markForCheck();
  }

  private canSubmitForm(form: FormComponent): boolean {
    return form && form.form && form.form.canSubmit;
  }

  private getFormValue(form: FormComponent): IEmailSchedule {
    return form && form.form && form.form.serializedValue;
  }
}
