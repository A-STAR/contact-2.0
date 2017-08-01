import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import * as R from 'ramda';
import { IIdentityDoc } from '../identity.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { ValueConverterService } from '../../../../../core/converter/value-converter.service';
import { EntityBaseComponent } from '../../../../components/entity/edit/entity.base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-identity',
  templateUrl: './add.identity.component.html',
})

export class AddIdentityComponent extends EntityBaseComponent<IIdentityDoc> implements OnInit {
  @Input() identityDoc: IIdentityDoc[];
  @Output() add: EventEmitter<IIdentityDoc> = new EventEmitter<IIdentityDoc>();

  formData: IIdentityDoc;

  constructor(private valueService: ValueConverterService) {
    super();
  }

  ngOnInit(): void {
    this.formData = {
      isMain: 0,
      docNumber: null,
      docTypeCode: null,
    };
    super.ngOnInit();
  }

  toSubmittedValues(values: IIdentityDoc): IIdentityDoc {
    // const getFirstElementValue = R.compose(R.prop('value'), R.head);
    return {
      ...values,
      // docTypeCode: getFirstElementValue(values.docTypeCode) && values.docTypeCode[0].value,
      docTypeCode: Array.isArray(values.docTypeCode) && values.docTypeCode[0].value,
      issueDate: values.issueDate && this.valueService.toISO(values.issueDate as Date) || null,
      expiryDate: values.expiryDate && this.valueService.toISO(values.expiryDate as Date) || null,
      citizenship: R.prop('value')(values.citizenship[0]) as string,
      isMain: Number(values.isMain || null),
    };
  }

  onSave(): void {
    const serialized = this.toSubmittedValues(this.dynamicForm.value);
    // console.log('unserialized', this.dynamicForm.value);
    // console.log('serialized', serialized);
    this.add.emit(serialized);
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'identityDocs.grid.docTypeCode',
        controlName: 'docTypeCode',
        type: 'select',
        options: [
          { value: 1, label: 'Паспорт' },
          { value: 2, label: 'Загранпаспорт' }
        ],
        required: true,
      },
      {
        label: 'identityDocs.grid.docNumber',
        controlName: 'docNumber',
        type: 'text',
        required: true,
      },
      {
        label: 'identityDocs.grid.issueDate',
        controlName: 'issueDate',
        type: 'datepicker',
      },
      {
        label: 'identityDocs.grid.issuePlace',
        controlName: 'issuePlace',
        type: 'text',
      },
      {
        label: 'identityDocs.grid.expiryDate',
        controlName: 'expiryDate',
        type: 'datepicker',
      },
      {
        label: 'identityDocs.grid.citizenship',
        controlName: 'citizenship',
        type: 'select',
        options: [
          { value: 'Russia', label: 'Russia' },
          { value: 'Italy', label: 'Italy' },
          { value: 'France', label: 'France' },
          { value: 'Germany', label: 'Germany' },
        ]
      },
      {
        label: 'identityDocs.grid.comment',
        controlName: 'comment',
        type: 'textarea',
      },
      {
        label: 'identityDocs.grid.isMain',
        controlName: 'isMain',
        type: 'checkbox',
        required: true,
      },
    ];
  }
}
