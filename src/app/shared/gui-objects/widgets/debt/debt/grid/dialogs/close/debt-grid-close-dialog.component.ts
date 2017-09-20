import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDebt } from '../../../debt.interface';
import { IDynamicFormControl } from '../../../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IUserConstant } from '../../../../../../../../core/user/constants/user-constants.interface';

import { DebtService } from '../../../debt.service';
import { UserConstantsService } from '../../../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../../components/form/dynamic-form/dynamic-form.component';

import { toOption } from '../../../../../../../../core/utils';

@Component({
  selector: 'app-debt-grid-close-dialog',
  templateUrl: './debt-grid-close-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridCloseDialogComponent implements AfterViewInit {
  @Input() debt: IDebt;
  @Input() statusCode: number;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = [
    { controlName: 'reasonCode', type: 'select', options: [] },
    { controlName: 'comment', type: 'textarea' }
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.closeDebt.${control.controlName}` }) as IDynamicFormControl);

  private personId = (this.route.params as any).value.personId || null;
  private formDataSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private route: ActivatedRoute,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngAfterViewInit(): void {
    this.formDataSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE),
      this.userConstantsService.get('Debt.StatusReason.MandatoryList'),
    )
    .distinctUntilChanged()
    .subscribe(([ dictionary, reasonCodeRequired ]) => {
      const reasonCodeControl = this.getControl('reasonCode');

      reasonCodeControl.options = dictionary
        .filter(term => term.parentCode === this.statusCode)
        .map(toOption('code', 'name'));

      reasonCodeControl.required = this.isReasonCodeRequired(reasonCodeRequired, this.statusCode);

      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const data = {
      ...this.form.requestValue,
      statusCode: this.statusCode
    };
    this.debtService.changeStatus(this.personId, this.debt.id, data).subscribe(() => {
      this.submit.emit();
      this.close.emit();
    });
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
