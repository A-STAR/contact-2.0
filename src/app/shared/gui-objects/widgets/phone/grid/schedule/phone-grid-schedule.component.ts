import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ISMSSchedule } from '../../phone.interface';

import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { PhoneGridScheduleFormComponent } from './form/phone-grid-schedule-form.component';

@Component({
  selector: 'app-phone-grid-schedule',
  templateUrl: './phone-grid-schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleComponent {
  @Input() personId: number;
  @Input() personRole: number;
  @Input() phoneId: number;

  @Output() submit = new EventEmitter<ISMSSchedule>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('formText') formText: PhoneGridScheduleFormComponent;
  @ViewChild('formTemplate') formTemplate: PhoneGridScheduleFormComponent;

  private tabIndex: number;
  private routeParams = (<any>this.route.params).value;

  debtId = this.routeParams.debtId || null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canSubmit(): boolean {
    return this.tabIndex === 0
      ? this.canSubmitForm(this.formText)
      : this.canSubmitForm(this.formTemplate);
  }

  get isTextTabDisabled$(): Observable<boolean> {
    return this.userPermissionsService.has('SMS_TEXT_SINGLE_FORM').map(permission => !permission);
  }

  onSubmit(): void {
    const value = this.tabIndex === 0
      ? this.getFormValue(this.formText)
      : this.getFormValue(this.formTemplate);
    this.submit.emit(value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onTabSelect(tabIndex: number): void {
    this.tabIndex = tabIndex;
    this.cdRef.markForCheck();
  }

  private canSubmitForm(form: PhoneGridScheduleFormComponent): boolean {
    return form && form.form && form.form.canSubmit;
  }

  private getFormValue(form: PhoneGridScheduleFormComponent): ISMSSchedule {
    return form && form.form && form.form.serializedValue;
  }
}
