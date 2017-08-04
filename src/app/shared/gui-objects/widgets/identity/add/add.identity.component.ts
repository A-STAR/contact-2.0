import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as R from 'ramda';

import { IIdentityDoc } from '../identity.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { EntityBaseComponent } from '../../../../components/entity/edit/entity.base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-identity',
  templateUrl: './add.identity.component.html',
})

export class AddIdentityComponent extends EntityBaseComponent<IIdentityDoc> implements OnInit {
  @Input() identityDoc: IIdentityDoc[];
  @Output() add = new EventEmitter<IIdentityDoc>();

  formData: IIdentityDoc;

  controls: IDynamicFormControl[] = [
    { label: 'debtor.identityDocs.grid.docTypeCode', controlName: 'docTypeCode', type: 'select', options: [], required: true, },
    { label: 'debtor.identityDocs.grid.docNumber', controlName: 'docNumber',  type: 'text', required: true, },
    { label: 'debtor.identityDocs.grid.issueDate', controlName: 'issueDate', type: 'datepicker', },
    { label: 'debtor.identityDocs.grid.issuePlace', controlName: 'issuePlace', type: 'text', },
    { label: 'debtor.identityDocs.grid.expiryDate', controlName: 'expiryDate', type: 'datepicker', },
    { label: 'debtor.identityDocs.grid.citizenship', controlName: 'citizenship', type: 'text', },
    { label: 'debtor.identityDocs.grid.comment', controlName: 'comment', type: 'textarea', },
    { label: 'debtor.identityDocs.grid.isMain', controlName: 'isMain', type: 'checkbox', required: true, },
  ];

  constructor(
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueService: ValueConverterService,
  ) {
    super();
    Observable.combineLatest(
      this.userPermissionsService.has('IDENTITY_DOCUMENT_ADD'),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_IDENTITY_TYPE),
    )
    .take(1)
    .subscribe(([ canAdd, identityTypes ]) => {
      this.controls = this.controls.map((control: IDynamicFormControl) => {
        if (control.controlName === 'docTypeCode') {
          control.options = [].concat(identityTypes);
        }
        return control;
      })
      .map(control => canAdd ? control : { ...control, disabled: true });
    });
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
    return {
      ...values,
      docTypeCode: Array.isArray(values.docTypeCode) && values.docTypeCode[0].value,
      issueDate: values.issueDate && this.valueService.toISO(values.issueDate as Date) || null,
      expiryDate: values.expiryDate && this.valueService.toISO(values.expiryDate as Date) || null,
      isMain: Number(values.isMain || null),
    };
  }

  onSave(): void {
    const serialized = this.toSubmittedValues(this.dynamicForm.value);
    this.add.emit(serialized);
  }

  protected getControls(): Array<IDynamicFormControl> {
    return this.controls;
  }
}
