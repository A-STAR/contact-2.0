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
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IPerson } from '../../debtor.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';

import { DebtorService } from '../../debtor.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-information-company',
  templateUrl: 'company.component.html',
})
export class CompanyComponent implements OnInit, OnDestroy {
  @Input() personTypeCode: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  // See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=108101644#id-Списокатрибутовсущностей-person
  private attributeIds = range(363, 372).concat(395);
  private personSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private entityAttributesService: EntityAttributesService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.personSubscription = combineLatest(
      this.userConstantsService.get(this.stringValuesConstantsName),
      this.userPermissionsService.has('PERSON_INFO_EDIT'),
      this.entityAttributesService.getAttributes(this.attributeIds),
    )
    .subscribe(([ stringValues, canEdit, attributes ]) => {
      this.controls = this.getControls(stringValues, canEdit, attributes);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.personSubscription.unsubscribe();
  }

  readonly debtor$: Observable<IPerson> = this.debtorService.debtor$;

  protected getControls(stringValues: IUserConstant, _: boolean, attributes: IEntityAttributes): IDynamicFormControl[] {
    const displayedStringValues = stringValues.valueS.split(/,\s*/).map(Number);
    return this.attributeIds.map((id, i) => ({
      label: `person.stringValue${i + 1}`,
      controlName: `stringValue${i + 1}`,
      type: 'text',
      width: 3,
      display: displayedStringValues.includes(id) && attributes[id].isUsed,
      required: displayedStringValues.includes(id) && !!attributes[id].isMandatory,
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
