import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';

import { Debt } from '@app/entities';
import { IDynamicFormControl, IDynamicFormSelectControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { toOption } from '@app/core/utils';

@Component({
  selector: 'app-debt-grid-close-dialog',
  templateUrl: './debt-grid-close-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridCloseDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() debt: Debt;
  @Input() statusCode: number;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  controls: Array<IDynamicFormControl> = [
    { controlName: 'reasonCode', type: 'select', options: [] },
    { controlName: 'comment', type: 'textarea' }
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.closeDebt.${control.controlName}` }) as IDynamicFormControl);

  private formDataSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private workplacesService: WorkplacesService,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngAfterViewInit(): void {
    this.formDataSubscription = combineLatest(
      this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE),
      this.userConstantsService.get('Debt.StatusReason.MandatoryList'),
    )
    .pipe(distinctUntilChanged())
    .subscribe(([ dictionary, reasonCodeRequired ]) => {
      const reasonCodeControl = this.getControl('reasonCode') as IDynamicFormSelectControl;

      reasonCodeControl.options = dictionary
        .filter(term => term.parentCode === this.statusCode)
        .map(toOption('code', 'name'));

      reasonCodeControl.required = this.isReasonCodeRequired(reasonCodeRequired, this.statusCode);

      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.formDataSubscription.unsubscribe();
  }

  onSubmit(): void {
    const data = {
      ...this.form.serializedUpdates,
      statusCode: this.statusCode
    };
    const debtorId = this.debtorService.debtorId$.value;
    if (debtorId) {
      this.workplacesService.changeStatus(debtorId, this.debt.id, data, false)
      .subscribe(() => {
        this.submit.emit();
        this.onClose();
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }

  private isReasonCodeRequired(reasonCodeRequired: IUserConstant, code: number): boolean {
    return reasonCodeRequired.valueS === 'ALL' || reasonCodeRequired.valueS.split(',').map(Number).includes(code);
  }
}
