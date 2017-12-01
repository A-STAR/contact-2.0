import {
  Component,
  ChangeDetectorRef ,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormControl, IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ISingleVisit, IVisitsBundle } from '../visit-add.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { VisitAddService } from '../visit-add.service';

const label = makeKey('massOperations.visitAdd');

@Component({
  selector: 'app-visit-add-dialog',
  templateUrl: 'visit-add-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitAddDialogComponent  implements  OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() visitRelsIds: ISingleVisit[];
  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  controls: Array<IDynamicFormItem>;
  // dialog = null;
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
  ) { }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  ngOnInit(): void {
    this.addressCounter.count = this.visitRelsIds.length ;
    Observable.combineLatest(
      // TODO mock (m.bobryshev) swap with VISIT_ADD when permission will be founded
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

  onSubmit(): void {
    const actionData = this.form.serializedUpdates;
    this.visitAddService.createVisit(this.visitRelsIds, actionData)
      .subscribe(() => {
          this.onCancel();
        });
  }

  onCancel(): void {
    // this.setDialog();
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
