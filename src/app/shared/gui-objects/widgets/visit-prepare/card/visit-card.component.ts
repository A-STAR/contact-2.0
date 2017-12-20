import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from 'app/core/converter/value-converter.interface';
import { IVisit } from '../visit-prepare.interface';

import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.visit.card');

@Component({
  selector: 'app-visit-card',
  templateUrl: './visit-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCardComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  visit: Partial<IVisit> = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) { }

  ngOnInit(): void {
    this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_VISIT_PURPOSE)
      .pipe(first())
      .subscribe(visitOpts => {
        this.controls = this.createControls(visitOpts);
        this.cdRef.markForCheck();
      });
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
}
