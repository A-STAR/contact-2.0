import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ICampaign } from '../campaigns.interface';
import { CampaignsService } from '../campaigns.service';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { IOption, INamedValue } from '../../../../core/converter/value-converter.interface';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';
import { EntityTranslationsService } from '../../../../core/entity/translations/entity-translations.service';
import { IEntityTranslation } from '../../../../core/entity/translations/entity-translations.interface';

@Component({
  selector: 'app-campaigns-edit',
  templateUrl: './campaigns-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignsEditComponent implements OnInit {
  @Input() editedEntity: ICampaign;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  controls: Array<IDynamicFormControl>;
  campaignGroups: Array<INamedValue>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
    private campaignsService: CampaignsService,
    private entityTranslationsService: EntityTranslationsService
  ) { }

  ngOnInit(): void {
    Observable.combineLatest(
      this.campaignsService.fetchCampaignGroups(),
      (this.editedEntity ? this.entityTranslationsService.readCampaignNameTranslations(this.editedEntity.id) : Observable.of([]))
    )
      .take(1)
      .subscribe(([groupNames, translations]) => {
        this.campaignGroups = groupNames;
        if (this.editedEntity) {
          this.editedEntity.multiName = translations;
        }
        this.controls = this.buildControls(
          this.valueConverterService.valuesToOptions(groupNames),
          this.entityTranslationsToSelectOptions(translations)
        );
        this.cdRef.markForCheck();
      });
  }

  get title(): string {
    return this.editedEntity ? 'utilities.campaigns.edit.title' : 'utilities.campaigns.create.title';
  }

  onCancel(): void {
    this.cancel.emit();
  }

  toSubmittedValues(campaign: any): ICampaign {
    const groupName = this.campaignGroups.find(campaignGroup => campaignGroup.id === campaign.groupName);
    const isMultiNameChanged = campaign.multiName && Object.keys(campaign.multiName).length;
    return {
      ...campaign,
      id: this.editedEntity && this.editedEntity.id,
      name: isMultiNameChanged ? this.selectOptionsToEntityTranslations(campaign.multiName) : campaign.name,
      groupName: groupName ? groupName.name : undefined,
      groupId: campaign.groupId
    };
  }

  onSubmit(): void {
    const campaign = this.form.serializedUpdates;
    this.submit.emit(this.toSubmittedValues(campaign));
    this.onCancel();
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  protected buildControls(groupNames: Array<IOption>,
    languageOptions: IOption[]): Array<IDynamicFormControl> {
    const nameControlOptions = this.getNameControlConfig(!!this.editedEntity, languageOptions);
    return [
      { ...nameControlOptions },
      { label: 'utilities.campaigns.edit.groupId', controlName: 'groupId', type: 'select',
        options: groupNames, required: true },
      { label: 'utilities.campaigns.edit.typeCode', controlName: 'typeCode', type: 'selectwrapper',
        dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_TYPE, required: true },
      { label: 'utilities.campaigns.edit.comment', controlName: 'comment', type: 'text' },
      { label: 'utilities.campaigns.edit.timeZoneUsed', controlName: 'timeZoneUsed', type: 'checkbox' },
    ];
  }

  private selectOptionsToEntityTranslations(selection: { [key: number]: string }[]): IEntityTranslation[] {
    return Object.keys(selection).map(selectedLanguageId => {
      return {
        languageId: parseInt(selectedLanguageId, 10),
        value: selection[selectedLanguageId]
      };
    });
  }

  private entityTranslationsToSelectOptions(translations: IEntityTranslation[]): IOption[] {
    return translations.map(translation => {
      return {
        label: translation.value,
        value: translation.languageId
      };
    });
  }

  private getNameControlConfig(isEditMode: boolean, languageOptions: IOption[]): IDynamicFormControl {
    let config: IDynamicFormControl;
    if (isEditMode) {
      config = {
        label: 'utilities.campaigns.edit.name', controlName: 'multiName', type: 'multitext',
        options: languageOptions, required: true
      };
    } else {
      config = {
        label: 'utilities.campaigns.edit.name', controlName: 'name', type: 'text', required: true
      };
    }
    return config;
  }

}
