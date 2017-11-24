import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormControl } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';

const label = makeKey('widgets.debt.dialogs.statusChange');

@Component({
  selector: 'app-call-center-toolbar-status-dialog',
  templateUrl: './status-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.userDictionariesService.getDictionaries([
      UserDictionariesService.DICTIONARY_DEBT_STATUS,
      UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE,
    ])
    .take(1)
    .subscribe(dictionaries => {
      const options = [];
      this.controls = this.buildControls(options);
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    // const { customStatusCode, statusCode, ...rest } = this.form.serializedUpdates;
    // const value = {
    //   ...rest,
    //   statusCode: customStatusCode || statusCode,
    // };
    // this.debtService.changeStatus(this.personId, this.debt.id, value).subscribe(() => {
    //   this.submit.emit();
    //   this.close.emit();
    // });
  }

  onClose(): void {
    this.close.emit();
  }

  private buildControls(options: any[]): IDynamicFormControl[] {
    return [
      { controlName: 'reasonCode', type: 'select', options },
      { controlName: 'comment', type: 'textarea' },
    ].map(control => ({ ...control, label: label(control.controlName) } as IDynamicFormControl));
  }
}
