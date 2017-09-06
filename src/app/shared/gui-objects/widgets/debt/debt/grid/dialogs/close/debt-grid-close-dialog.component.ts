import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';

import { IDebt } from '../../../debt.interface';
import { IDynamicFormControl } from '../../../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IUserConstant } from '../../../../../../../../core/user/constants/user-constants.interface';

import { DebtService } from '../../../debt.service';
import { UserConstantsService } from '../../../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../../../core/user/dictionaries/user-dictionaries.service'
import { UserPermissionsService } from '../../../../../../../../core/user/permissions/user-permissions.service'

import { DynamicFormComponent } from '../../../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-grid-status-dialog',
  templateUrl: './debt-grid-status-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridStatusDialogComponent implements AfterViewInit, OnDestroy {
  @Input() debt: IDebt;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = [
    { controlName: 'statusCode', type: 'radio', required: true, radioOptions: [] },
    { controlName: 'reasonCode', type: 'select', options: [] },
    { controlName: 'customStatusCode', type: 'select', options: [], disabled: true },
    { controlName: 'comment', type: 'textarea' }
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.statusChange.${control.controlName}` }) as IDynamicFormControl);

  private personId = (this.route.params as any).value.id || null;

  private formDataSubscription: Subscription;
  private statusCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private route: ActivatedRoute,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  onSubmit(): void {
    const { requestValue } = this.form;
    this.debtService.changeStatus(this.personId, this.debt.id, requestValue).subscribe(() => {
      this.submit.emit();
      this.close.emit();
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
