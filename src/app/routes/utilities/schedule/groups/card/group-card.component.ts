import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IGroup } from '../groups.interface';

import { GroupsService } from '../groups.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'widgets.groups.card',
  };
  group: Partial<IGroup>;
  groupId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: GroupsService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {

    this.route.paramMap.map(params => (this.groupId = Number(params.get('groupId'))))
    .switchMap(groupId => {
      const group$ = groupId ? this.groupService.fetch(groupId) : of(this.getFormData());
      return combineLatest(
        group$.flatMap(group => this.groupId ? this.groupService.canEdit$(group as IGroup) : this.groupService.canAdd$),
        this.groupService.canConditionEdit$,
        group$,
        this.groupService.groupEntityTypeOptions$,
      );
    })
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
      this.groupService.dispatchAction(GroupsService.MESSAGE_GROUP_SAVED);
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
        controlName: 'names',
        type: 'multilanguage',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_GROUP_NAME,
          entityId: this.groupId
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
