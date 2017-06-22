import { Component, OnDestroy } from '@angular/core';

import { ITerm } from '../../../../../core/dictionaries/dictionaries.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';

import { DictionariesService } from '../../../../../core/dictionaries/dictionaries.service';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { ILabeledValue } from "../../../../../core/converter/value/value-converter.interface";

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html'
})
export class TermEditComponent extends EntityBaseComponent<ITerm> implements OnDestroy {

  private termsSubscription;
  private terms: ILabeledValue[];

  constructor(dictionariesService: DictionariesService) {
    super();

    this.termsSubscription = dictionariesService.terms.subscribe((terms: ITerm[]) => {
      this.terms = terms.map((term: ITerm) => {
        return { label: term.name, value: term.id };
      });
    });
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'terms.edit.code',
        controlName: 'code',
        type: 'number',
        required: true
      },
      {
        label: 'terms.edit.text',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'terms.edit.type',
        controlName: 'typeCode',
        type: 'select',
        required: true,
        // TODO Duplication
        options: [
          { label: 'dictionaries.types.system', value: 1 },
          { label: 'dictionaries.types.client', value: 2 },
        ]
      },
      {
        label: 'terms.edit.parent',
        controlName: 'parentCode',
        type: 'select',
        options: this.terms,
        optionsActions: [
          { text: 'terms.edit.select.title', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'terms.edit.closed',
        controlName: 'isClosed',
        type: 'checkbox'
      },
    ];
  }

  ngOnDestroy(): void {
    this.termsSubscription.unsubscribe();
  }
}
