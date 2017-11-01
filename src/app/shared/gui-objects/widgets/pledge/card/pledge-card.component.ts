import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledgeContract } from '../pledge.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { PledgeService } from '../pledge.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.pledgeContract.card');

@Component({
  selector: 'app-pledge-card',
  templateUrl: './pledge-card.component.html'
})
export class PledgeCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormGroup[];
  contract: Partial<IPledgeContract>;

  constructor(
    private contentTabService: ContentTabService,
    private pledgeService: PledgeService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.pledgeService.canAdd$,
      Observable.of(this.getFormData())
    )
    .take(1)
    .subscribe(([ typeOptions, canEdit, contract ]) => {
      this.initControls(canEdit, typeOptions);
      this.contract = contract;
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
  }

  onBack(): void {
    this.contentTabService.back();
  }

  private initControls(canEdit: boolean, typeOptions: IOption[]): void {
    this.controls = [
      {
        title: 'widgets.pledgeContract.title', collapsible: true,
        children: [
          { label: label('contractNumber'), controlName: 'contractNumber',  type: 'text', required: true },
          { label: label('contractStartDate'), controlName: 'contractStartDate', type: 'datepicker', },
          { label: label('contractEndDate'), controlName: 'contractEndDate', type: 'datepicker', },
          {
            label: label('typeCode'), controlName: 'typeCode',
            type: 'select', options: typeOptions, required: true
          },
          { label: label('comment'), controlName: 'comment', type: 'textarea', }
        ]
      }
    ];

    this.controls = this.controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
  }

  private getFormData(): Partial<IPledgeContract> {
    return {
      typeCode: 1
    };
  }
}
