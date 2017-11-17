import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ICampaign } from '../campaigns.interface';
import { isObject } from 'util';
import { CampaignsService } from '../campaigns.service';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { LookupService } from '../../../../core/lookup/lookup.service';
import { IOption } from '../../../../core/converter/value-converter.interface';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

@Component({
  selector: 'app-campaigns-edit',
  templateUrl: './campaigns-edit.component.html',
  styleUrls: ['./campaigns-edit.component.scss']
})
export class CampaignsEditComponent implements OnInit {
  @Input() editedEntity: ICampaign | null;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  controls: Array<IDynamicFormControl>;


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
          this.editedEntity = this.setMultiTextName(this.editedEntity, languages);
        }
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
    const typeCode = campaign.typeCode || (this.editedEntity && this.editedEntity.typeCode);
    const groupId = campaign.groupName || (this.editedEntity && this.editedEntity.groupId);
    const name = campaign.name || (this.editedEntity && this.editedEntity.name);
    return {
      ...campaign,
      id: this.editedEntity && this.editedEntity.id,
      name: isObject(name)
        ? Object.keys(name).reduce((acc, k) => [...acc, { languageId: parseInt(k, 10), value: name[k] }], [])
        : name,
      typeCode: Array.isArray(typeCode) ? typeCode[0].value : typeCode,
      groupId: Array.isArray(groupId) ? groupId[0].value : groupId
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
      { label: 'utilities.campaigns.edit.name', controlName: 'name', type: 'multitext',
        options: languages, required: true },
      { label: 'utilities.campaigns.edit.groupName', controlName: 'groupName', type: 'select',
        options: groupNames, required: true },
      { label: 'utilities.campaigns.edit.typeCode', controlName: 'typeCode', type: 'select', options: callTypes },
      { label: 'utilities.campaigns.edit.comment', controlName: 'comment', type: 'text' },
      { label: 'utilities.campaigns.edit.timeZoneUsed', controlName: 'timeZoneUsed', type: 'checkbox' },
    ];
  }

  private setMultiTextName(data: { name: string }, languages: IOption[]): any {
    return {
      ...data,
      name: languages.map(language => {
        return { languageId: language.value, value: data.name };
      })
    };
  }

}
