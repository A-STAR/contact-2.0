import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import * as R from 'ramda';
import { IIdentityDoc } from '../identity.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { ValueConverterService } from '../../../../../core/converter/value-converter.service';
import { EntityBaseComponent } from '../../../../components/entity/edit/entity.base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-identity',
  templateUrl: './edit.identity.component.html',
})

export class EditIdentityComponent extends EntityBaseComponent<IIdentityDoc> implements OnInit {
  @Input() identityDoc: IIdentityDoc;
  @Output() edit = new EventEmitter<IIdentityDoc>();

  formData: IIdentityDoc;

  constructor(private valueService: ValueConverterService) {
    super();
  }

  ngOnInit(): void {
    this.formData = Object.assign({}, this.identityDoc);
    super.ngOnInit();
  }

  toSubmittedValues(values: IIdentityDoc): IIdentityDoc {
    return {
      ...values,
      docTypeCode: Array.isArray(values.docTypeCode) && values.docTypeCode[0].value,
      citizenship: R.prop('value')(values.citizenship[0]) as string,
      expiryDate: values.expiryDate && this.valueService.toISO(values.expiryDate as Date) || null,
      issueDate: values.issueDate && this.valueService.toISO(values.issueDate as Date) || null,
      isMain: Number(values.isMain || null),
    };
  }

  onSave(): void {
    const serialized = this.toSubmittedValues(this.dynamicForm.value);
    this.edit.emit(serialized);
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'debtor.identityDocs.grid.docTypeCode',
        controlName: 'docTypeCode',
        type: 'select',
        options: [
          { value: 1, label: 'Паспорт' },
          { value: 2, label: 'Загранпаспорт' }
        ],
        required: true,
      },
      {
        label: 'debtor.identityDocs.grid.docNumber',
        controlName: 'docNumber',
        type: 'text',
        required: true,
      },
      {
        label: 'debtor.identityDocs.grid.issueDate',
        controlName: 'issueDate',
        type: 'datepicker',
      },
      {
        label: 'debtor.identityDocs.grid.issuePlace',
        controlName: 'issuePlace',
        type: 'text',
      },
      {
        label: 'debtor.identityDocs.grid.expiryDate',
        controlName: 'expiryDate',
        type: 'datepicker',
      },
      {
        label: 'debtor.identityDocs.grid.citizenship',
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
        label: 'debtor.identityDocs.grid.comment',
        controlName: 'comment',
        type: 'textarea',
      },
      {
        label: 'debtor.identityDocs.grid.isMain',
        controlName: 'isMain',
        type: 'checkbox',
        required: true,
      },
    ];
  }
}
