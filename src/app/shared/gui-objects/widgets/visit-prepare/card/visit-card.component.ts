import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from 'app/core/converter/value-converter.interface';
import { IVisit, IVisitOperator } from '../visit-prepare.interface';

import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';
import { VisitPrepareService } from '../visit-prepare.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.visit.card');

@Component({
  selector: 'app-visit-card',
  templateUrl: './visit-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCardComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  visit: Partial<IVisit> = {};

  private operatorSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
    private visitPrepareService: VisitPrepareService,
  ) { }

  ngOnInit(): void {
    this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_VISIT_PURPOSE)
      .pipe(first())
      .subscribe(visitOpts => {
        this.controls = this.createControls(visitOpts);
        this.cdRef.markForCheck();
      });

    this.operatorSubscription = this.visitPrepareService.getPayload<IVisitOperator>(VisitPrepareService.MESSAGE_OPERATOR_SELECTED)
      .subscribe(operator => {
        if (this.form) {
          this.setPlanUserId(operator);
          this.cdRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.operatorSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  private createControls(visitOpts: IOption[]): Array<IDynamicFormItem> {
    return [
      { label: label('purposeCode'), controlName: 'purposeCode', type: 'select', options: visitOpts },
      {
        label: label('planVisitDateTime'), controlName: 'planVisitDateTime',
        type: 'datepicker', displayTime: true, required: true
      },
      { label: label('planUserId'), controlName: 'planUserId', type: 'text', display: false, required: true },
      { label: label('comment'), controlName: 'comment', type: 'textarea' },
    ];
  }

  private setPlanUserId(operator: IVisitOperator): void {
    const control = this.form.getControl('planUserId');
    control.setValue(operator.id);
    control.markAsDirty();
  }
}
