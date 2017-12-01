import {
  Component,
  ChangeDetectorRef ,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { IActionGridDialogSelectionParams } from '../../../../components/action-grid/action-grid.interface';
import { IDynamicFormControl, IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ISingleVisit, IVisitsBundle } from '../visit-add.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey } from '../../../../../core/utils';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { VisitAddService } from '../visit-add.service';

const label = makeKey('massOperations.visitAdd');

@Component({
  selector: 'app-visit-add-dialog',
  templateUrl: 'visit-add-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitAddDialogComponent extends DialogFunctions implements OnChanges, OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() visitRelsIds: any[];
  @Input() buff: IActionGridDialogSelectionParams;
  @Output() close = new EventEmitter<void>();
  // @Output() submit = new EventEmitter<IConstant>();
  @Output() cancel = new EventEmitter<void>();

  controls: Array<IDynamicFormItem>;
  dialog = null;
  formData: IVisitsBundle;

  addressCounter = {
    count: null
  };

  totalCount: number;
  successCount: number;
  comment: string;
  purposeCode: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private visitAddService: VisitAddService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  ngOnInit(): void {
    Observable.combineLatest(
      // TODO swap with VISIT_ADD when permission will be founded
      this.userPermissionsService.has('VISIT_CANCEL'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_VISIT_PURPOSE)
    ).subscribe(([canAddVisit, options]) => {
      if (!canAddVisit) {
        return;
      }
      this.controls = this.getControls(options);
      this.addressCounter.count = this.visitRelsIds.length;
      this.formData = {
        actionData: {
          purposeCode: null,
          comment: null
        }
      };
      this.cdRef.markForCheck();
    });
  }

  ngOnChanges(): void {
    this.addressCounter.count = this.visitRelsIds &&  this.visitRelsIds.length ;
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    this.setDialog();
    this.cdRef.markForCheck();
    const actionData = this.form.serializedUpdates;
    this.visitAddService.createVisit(this.visitRelsIds, actionData)
      .subscribe((res) => {
          this.onCancel();
          this.cdRef.markForCheck();
        });
  }

  onCancel(): void {
    this.setDialog();
    this.close.emit();
  }

  private getControls(options: IOption[]): Array<IDynamicFormControl> {
    return [
      { label: label('idData'), controlName: 'idData', type: 'hidden', required: true, disabled: true },
      { label: label('purposeCode'), controlName: 'purposeCode',
        type: 'select', required: true, disabled: false, options },
      { label: label('comment'), controlName: 'comment', type: 'textarea', required: false, disabled: false },
    ];
  }
}
