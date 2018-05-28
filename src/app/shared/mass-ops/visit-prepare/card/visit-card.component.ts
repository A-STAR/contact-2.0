import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { IVisit, IVisitOperator } from '../visit-prepare.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { VisitPrepareService } from '../visit-prepare.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

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

  private planUserId: number;
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
        this.planUserId = operator.id;
      });
  }

  ngOnDestroy(): void {
    this.operatorSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.planUserId && this.form && this.form.canSubmit;
  }

  get data(): any {
    return { ...this.form.serializedUpdates, planUserId: this.planUserId };
  }

  private createControls(visitOpts: IOption[]): Array<IDynamicFormItem> {
    return [
      { label: label('purposeCode'), controlName: 'purposeCode', type: 'select', options: visitOpts },
      { label: label('planVisitDateTime'), controlName: 'planVisitDateTime', type: 'datetimepicker', required: true },
      { label: label('comment'), controlName: 'comment', type: 'textarea' },
    ];
  }
}
