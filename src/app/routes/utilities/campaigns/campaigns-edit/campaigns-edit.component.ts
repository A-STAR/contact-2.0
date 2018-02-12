import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { first } from 'rxjs/operators';

import { ICampaign } from '../campaigns.interface';
import { IDynamicFormItem, IDynamicFormConfig } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { EntityTranslationsConstants } from '../../../../core/entity/translations/entity-translations.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';

import { CampaignsService } from '../campaigns.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-campaigns-edit',
  templateUrl: './campaigns-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignsEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() campaign: ICampaign;

  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  config: IDynamicFormConfig = {
    labelKey: 'utilities.campaigns.edit',
  };
  controls: IDynamicFormItem[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
    private campaignsService: CampaignsService,
  ) { }

  ngOnInit(): void {
      this.campaignsService.fetchCampaignGroups()
        .pipe(first())
        .subscribe(groupNames => {
          this.controls = this.getControls(this.valueConverterService.valuesToOptions(groupNames));
          this.cdRef.markForCheck();
        });
  }

  get title(): string {
    return this.campaign ? 'utilities.campaigns.edit.title' : 'utilities.campaigns.create.title';
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    this.submit.emit(this.form.serializedUpdates);
    this.onCancel();
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  private getControls(groupNames: Array<IOption>): IDynamicFormItem[] {
    const controls = [
      {
        controlName: 'names',
        type: 'multilanguage',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_CAMPAIGN_NAME,
          entityId: this.campaign && this.campaign.id
        },
        required: true
      },
      {
        controlName: 'groupId',
        type: 'select',
        options: groupNames,
        required: true
      },
      {
        controlName: 'typeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_TYPE,
        required: true
      },
      {
        controlName: 'comment',
        type: 'text'
      },
      {
        controlName: 'timeZoneUsed',
        type: 'checkbox'
      },
    ] as IDynamicFormItem[];

    return controls;
  }

}
