import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl } from '../../../../../../../components/form/dynamic-form/dynamic-form.interface';

import { UserDictionariesService } from '../../../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-grid-close-dialog',
  templateUrl: './debt-grid-close-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridCloseDialogComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = [
    { controlName: 'reasonCode', type: 'select', required: true, options: [] },
    { controlName: 'comment', type: 'textarea' }
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.close.${control.controlName}` }) as IDynamicFormControl);

  private formDataSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngAfterViewInit(): void {
    this.formDataSubscription = this.userDictionariesService.getDictionaryAsOptions(
      UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE
    )
      .distinctUntilChanged()
      .subscribe(options => {
        this.getControl('reasonCode').options = options;
        this.cdRef.markForCheck();
      });
  }

  onSubmit(): void {
    this.submit.emit();
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }
}
