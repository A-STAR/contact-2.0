import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { first } from 'rxjs/operators';

import { IDynamicFormControl } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { CampaignService } from '../../campaign.service';
import { UserConstantsService } from '../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';

const label = makeKey('widgets.debt.dialogs.statusChange');

@Component({
  selector: 'app-call-center-toolbar-status-dialog',
  templateUrl: './status-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  constructor(
    private campaignService: CampaignService,
    private cdRef: ChangeDetectorRef,
    private userConstantsService: UserConstantsService,
  ) {}

  ngOnInit(): void {
    this.userConstantsService.get('Debt.StatusReason.MandatoryList')
      .pipe(first())
      .map(constant => constant.valueS)
      .subscribe(constant => {
        const isReasonRequired = constant === 'ALL' || constant.split(',').map(Number).includes(9);
        this.controls = this.buildControls(isReasonRequired);
        this.cdRef.markForCheck();
      });
  }

  get isFormDisabled(): boolean {
    return !(this.form && this.form.canSubmit);
  }

  onSubmit(): void {
    this.campaignService
      .changeStatusToProblematic(this.form.serializedUpdates)
      .subscribe(() => {
        this.campaignService.preloadCampaignDebt();
        this.close.emit();
      });
  }

  onClose(): void {
    this.close.emit();
  }

  private buildControls(isReasonRequired: boolean): IDynamicFormControl[] {
    return [
      {
        controlName: 'reasonCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE,
        parentCode: 6,
        required: isReasonRequired,
      },
      {
        controlName: 'comment',
        type: 'textarea',
      },
    ].map(control => ({ ...control, label: label(control.controlName) } as IDynamicFormControl));
  }
}
