import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import { IGroup } from '../group.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { GroupService } from '../group.service';

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

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.groupId ? this.groupService.canEdit$ : this.groupService.canAdd$,
      this.groupService.canConditionEdit$,
      this.groupId ? this.groupService.fetch(this.groupId) : Observable.of(this.getFormData()),
      this.groupService.groupEntityTypeOptions$
    )
    .pipe(first())
    .subscribe(([ canEdit, canConditionEdit, group, respTypeOpts ]) => {
      this.controls = this.initControls(canEdit, canConditionEdit, respTypeOpts);
      this.group = group;
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.groupId
      ? this.groupService.update(this.groupId, this.form.serializedValue)
      : this.groupService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.groupService.dispatchAction(GroupService.MESSAGE_GROUP_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.contentTabService.back();
  }

  private initControls(canEdit: boolean, canConditionEdit: boolean, entityTypeOptions: IOption[]): Array<IDynamicFormItem> {
    const controls = [
      { label: label('name'), controlName: 'name', type: 'text', disabled: !canEdit, required: true },
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

  private getFormData(): Partial<IGroup> {
    return {
      entityTypeCode: 19
    };
  }
}
