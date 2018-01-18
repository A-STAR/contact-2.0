import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Location } from '@angular/common';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { EntityTranslationsConstants } from '../../../../../core/entity/translations/entity-translations.interface';
import { IGroup } from '../group.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { GroupService } from '../group.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() groupId: number;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'widgets.groups.card',
  };
  group: Partial<IGroup>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: GroupService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const group$ = this.groupId ? this.groupService.fetch(this.groupId) : of(this.getFormData());
    combineLatest(
      group$.flatMap(group => this.groupId ? this.groupService.canEdit$(group as IGroup) : this.groupService.canAdd$),
      this.groupService.canConditionEdit$,
      group$,
      this.groupService.groupEntityTypeOptions$,
    )
    .pipe(first())
    .subscribe(([ canEdit, canConditionEdit, group, respTypeOpts ]) => {
      this.group = group;

      this.controls = this.initControls(canEdit, canConditionEdit, respTypeOpts);
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.groupId
      ? this.groupService.update(this.groupId, this.form.serializedUpdates)
      : this.groupService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.groupService.dispatchAction(GroupService.MESSAGE_GROUP_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.location.back();
  }

  private initControls(
    canEdit: boolean,
    canConditionEdit: boolean,
    entityTypeOptions: IOption[],
  ): IDynamicFormItem[] {
    const controls = [
      {
        controlName: 'name',
        type: this.groupId ? 'multilanguage' : 'text',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_GROUP_NAME,
          entityId: this.group && this.group.id
        },
        required: true,
        disabled: !canEdit
      },
      {
        controlName: 'entityTypeCode',
        type: 'select',
        options: entityTypeOptions,
        required: true,
        disabled: !canEdit,
        markAsDirty: !this.groupId,
      },
      { controlName: 'comment', type: 'textarea', disabled: !canEdit },
      { controlName: 'isManual', type: 'checkbox', disabled: !canEdit, markAsDirty: !this.groupId },
      {
        controlName: 'isPreCleaned',
        type: 'checkbox',
        disabled: !canEdit,
        markAsDirty: !this.groupId
      },
    ];

    if (canConditionEdit) {
      controls.push({ controlName: 'sql', type: 'textarea', disabled: !canEdit });
    }

    return controls as IDynamicFormItem[];
  }

  private getFormData(): Partial<IGroup> {
    return {
      entityTypeCode: 19
    };
  }
}
