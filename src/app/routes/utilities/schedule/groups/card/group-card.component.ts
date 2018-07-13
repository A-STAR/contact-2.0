import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import {
  IDynamicFormItem,
  IDynamicFormConfig,
  IDynamicFormControl,
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IGroup } from '../groups.interface';

import { GroupsService } from '../groups.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupCardComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'widgets.groups.card',
  };
  group: Partial<IGroup>;
  groupId: number;
  private groupSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: GroupsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.groupSub = this.groupService.canConditionEdit$
      .switchMap(canConditionEdit => {
        return combineLatest(of(canConditionEdit), this.getGroup(this.groupId));
      })
      .switchMap(([canConditionEdit, group]) =>
        combineLatest(
          group
            ? this.groupService.canEdit$(group as IGroup)
            : this.groupService.canAdd$,
          of(canConditionEdit),
          of(group),
          this.groupService.groupEntityTypeOptions$,
        ),
      )
      .subscribe(([canEdit, canConditionEdit, group, respTypeOpts]) => {
        this.group = group;
        this.initControls(canEdit, canConditionEdit, respTypeOpts);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.groupSub.unsubscribe();
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
    this.routingService.navigate([ '/app/utilities/schedule/all' ]);
  }

  private getGroup(groupId: number): Observable<Partial<IGroup>> {
    return groupId ? this.groupService.fetch(groupId) : of(this.getFormData());
  }

  private initControls(
    canEdit: boolean,
    canConditionEdit: boolean,
    entityTypeOptions: IOption[],
  ): void {
    if (this.controls) {
      const sqlControl = this.controls.find((c: IDynamicFormControl) => c.controlName === 'sql');
      if (sqlControl) {
        sqlControl.display = canConditionEdit;
      }
      this.form[canEdit ? 'enableControls' : 'disableControls'](this.controls as IDynamicFormControl[]);
    } else {
      this.controls = this.createControls(canEdit, canConditionEdit, entityTypeOptions);
    }
  }

  private createControls(
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
          entityId: this.groupId,
        },
        createMode: !this.groupId,
        required: true,
        disabled: !canEdit,
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
      {
        controlName: 'isManual',
        type: 'checkbox',
        disabled: !canEdit,
        markAsDirty: !this.groupId,
      },
      {
        controlName: 'isPreCleaned',
        type: 'checkbox',
        disabled: !canEdit,
        markAsDirty: !this.groupId,
      },
      {
        controlName: 'sql',
        type: 'textarea',
        disabled: !canEdit,
        display: canConditionEdit,
      },
    ];
    return controls as IDynamicFormItem[];
  }

  private getFormData(): Partial<IGroup> {
    return {
      entityTypeCode: 19,
    };
  }
}
