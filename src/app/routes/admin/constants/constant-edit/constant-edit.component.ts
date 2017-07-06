import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { EntityBaseComponent } from '../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IConstant } from '../constants.interface';

import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-constant-edit',
  templateUrl: './constant-edit.component.html'
})
export class ConstantEditComponent extends EntityBaseComponent<IConstant> implements OnInit, OnDestroy {
  private localizedOptions: any;
  private langSub: Subscription;

  formData: IConstant;

  constructor(
    private translateService: TranslateService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
    this.localizedOptions = this.translateService.instant('default.typeCode');
    this.langSub = this.translateService.onLangChange
      .subscribe(event => this.localizedOptions = event.translations.default.typeCode);
  }

  ngOnInit(): void {
    this.formData = {
      ...this.editedEntity,
      value: this.valueConverterService.fromIso(this.editedEntity.valueD)
    };
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  toSubmittedValues(constant: IConstant): IConstant {
    return {
      ...constant,
      value: this.valueConverterService.toIso(constant.value)
    };
  }

  protected getControls(): Array<IDynamicFormControl> {
    const options = [
      { label: this.localizedOptions.number, value: 1 },
      { label: this.localizedOptions.date, value: 2 },
      { label: this.localizedOptions.string, value: 3 },
      { label: this.localizedOptions.boolean, value: 4 },
      { label: this.localizedOptions.currency, value: 5 },
      { label: this.localizedOptions.dictionary, value: 6 },
    ];

    return [
      { label: 'id', controlName: 'id', type: 'hidden', required: true, disabled: true },
      { label: 'constants.edit.name', controlName: 'name', type: 'text', required: true, disabled: true },
      { label: 'constants.edit.type', controlName: 'typeCode', type: 'select', required: true, disabled: true, options },
      { label: 'constants.edit.value', controlName: 'value', type: 'dynamic', dependsOn: 'typeCode', required: true },
      { label: 'constants.edit.comment', controlName: 'dsc', type: 'textarea', required: true, disabled: true },
    ];
  }
}
