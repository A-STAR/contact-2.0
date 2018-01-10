import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Location } from '@angular/common';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEntityTranslation } from '../../../../../core/entity/translations/entity-translations.interface';
import { IGroup } from '../group.interface';
import { ILookupLanguage } from '../../../../../core/lookup/lookup.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { GroupService } from '../group.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.groups.card');

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent implements OnInit {

  @Input() groupId: number;

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  group: Partial<IGroup>;

  private languages: ILookupLanguage[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: GroupService,
    private location: Location,
    private lookupService: LookupService,
  ) {}

  ngOnInit(): void {
    const group$ = this.groupId ? this.groupService.fetch(this.groupId) : of(this.getFormData());
    combineLatest(
      group$.flatMap(group => this.groupId ? this.groupService.canEdit$(group as IGroup) : this.groupService.canAdd$),
      this.groupService.canConditionEdit$,
      group$,
      this.groupService.groupEntityTypeOptions$,
      this.groupId ? this.lookupService.languages : of([]),
      this.groupId ? this.groupService.readGroupNameTranslations(this.groupId) : of([])
    )
    .pipe(first())
    .subscribe(([ canEdit, canConditionEdit, group, respTypeOpts, languages, translations ]) => {
      this.group = group;
      this.group.multiName = translations;
      this.languages = languages;

      const languageOpts = languages.map(userLanguage =>
        ({ label: userLanguage.name, value: userLanguage.id, canRemove: !userLanguage.isMain, selected: userLanguage.isMain })
      );
      this.controls = this.initControls(canEdit, canConditionEdit, respTypeOpts, languageOpts);

      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.groupId
      ? this.groupService.update(this.groupId, this.serializeTranslatedGroup(this.form.serializedValue))
      : this.groupService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.groupService.dispatchAction(GroupService.MESSAGE_GROUP_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.location.back();
  }

  private serializeTranslatedGroup(group: IGroup): IGroup {
    const isMultiNameChanged = group.multiName && Object.keys(group.multiName).length;
    const result = {
      ...group,
      id: this.groupId,
      name: isMultiNameChanged ? this.createNameTranslations(group.multiName) : group.name,
    } as IGroup;
    delete result.multiName;
    return result;
  }

  private initControls(canEdit: boolean, canConditionEdit: boolean,
    entityTypeOptions: IOption[], languageOptions: IOption[]): Array<IDynamicFormItem> {
    const controls = [
      {
        label: label('name'),
        controlName: this.groupId ? 'multiName' : 'name',
        type: this.groupId ? 'multitext' : 'text',
        options: languageOptions,
        required: true,
        disabled: !canEdit
      },
      {
        label: label('entityTypeCode'), controlName: 'entityTypeCode', type: 'select',
        options: entityTypeOptions, required: true, disabled: !canEdit, markAsDirty: !this.groupId
      },
      { label: label('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit },
      { label: label('isManual'), controlName: 'isManual', type: 'checkbox', disabled: !canEdit, markAsDirty: !this.groupId },
      {
        label: label('isPreCleaned'), controlName: 'isPreCleaned', type: 'checkbox',
        disabled: !canEdit, markAsDirty: !this.groupId
      },
    ];

    if (canConditionEdit) {
      controls.push({ label: label('sql'), controlName: 'sql', type: 'textarea', disabled: !canEdit });
    }

    return controls as IDynamicFormItem[];
  }

  private createNameTranslations(selection: { [key: number]: string }[]): IEntityTranslation[] {
    return this.languages.map(language => ({
      languageId: language.id,
      value: selection[language.id]
    } as IEntityTranslation));
  }

  private getFormData(): Partial<IGroup> {
    return {
      entityTypeCode: 19
    };
  }
}
