import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from '../../debtor.interface';
import { IUserConstant } from '../../../../../../core/user/constants/user-constants.interface';

import { DebtorService } from '../../debtor.service';
import { UserConstantsService } from '../../../../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { range } from '../../../../../../core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-information-company',
  templateUrl: 'company.component.html',
})
export class CompanyComponent implements OnInit, OnDestroy {
  @Input() personTypeCode: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.personSubscription = this.userConstantsService.get(this.stringValuesConstantsName)
      .subscribe(stringValues => {
        this.controls = this.getControls(stringValues);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  get debtor$(): Observable<IPerson> {
    return this.debtorService.debtor$;
  }

  protected getControls(stringValues: IUserConstant): IDynamicFormControl[] {
    const displayedStringValues = stringValues.valueS.split(',').map(Number);
    return range(1, 10).map(i => ({
      label: `person.stringValue${i}`,
      controlName: `stringValue${i}`,
      type: 'text',
      width: 3,
      display: displayedStringValues.includes(i),
    }) as IDynamicFormControl);
  }

  private get stringValuesConstantsName(): string {
    switch (this.personTypeCode) {
      case 2: return 'Person.LegalEntity.AdditionalAttribute.List';
      case 3: return 'Person.SoleProprietorship.AdditionalAttribute.List';
      default: throw new Error(`Person type code must equal 2 or 3, got ${this.personTypeCode}`);
    }
  }
}
