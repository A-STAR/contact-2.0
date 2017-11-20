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
import { Observable } from 'rxjs/Observable';
import { ICampaign } from '../campaigns.interface';
import { isObject } from 'util';
import { CampaignsService } from '../campaigns.service';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { LookupService } from '../../../../core/lookup/lookup.service';
import { IOption, INamedValue } from '../../../../core/converter/value-converter.interface';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

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
    private userDictionariesService: UserDictionariesService,
    private valueConverterService: ValueConverterService,
    private campaignsService: CampaignsService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_TYPE),
      this.campaignsService.fetchCampaignGroups(),
      this.lookupService.lookupAsOptions('languages')
    )
      .take(1)
      .subscribe(([callTypes, groupNames, languages]) => {
        if (this.editedEntity && !isObject(this.editedEntity.name)) {
          this.editedEntity.multiname = this.setMultiTextName(this.editedEntity.name, languages);
        }
        this.campaignGroups = groupNames;
        this.controls = this.buildControls(callTypes, this.valueConverterService.valuesToOptions(groupNames), languages);
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
    const groupName = this.campaignGroups.find(campaignGroup => campaignGroup.id === campaign.groupId);
    // todo: ugly, find an api or a better way to handle multitext field
    const name = campaign.multiname ? campaign.multiname[Object.keys(campaign.multiname)[0]] : undefined;
    delete campaign.multiname;
    return {
      ...campaign,
      id: this.editedEntity && this.editedEntity.id,
      name,
      groupName: groupName ? groupName.name : undefined
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

  protected buildControls(callTypes: Array<IOption>, groupNames: Array<IOption>,
    languages: IOption[]): Array<IDynamicFormControl> {
    return [
      { label: 'utilities.campaigns.edit.name', controlName: 'multiname', type: 'multitext',
        options: languages, required: true },
      { label: 'utilities.campaigns.edit.groupId', controlName: 'groupId', type: 'select',
        options: groupNames, required: true },
      { label: 'utilities.campaigns.edit.typeCode', controlName: 'typeCode', type: 'select',
        options: callTypes, required: true },
      { label: 'utilities.campaigns.edit.comment', controlName: 'comment', type: 'text' },
      { label: 'utilities.campaigns.edit.timeZoneUsed', controlName: 'timeZoneUsed', type: 'checkbox' },
    ];
  }

  private setMultiTextName(name: string, languages: IOption[]): any[] {
    return languages.map(language => {
        return { languageId: language.value, value: name };
    });
  }

}
