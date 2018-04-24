/**
 * See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=129368072
 *
 * A. Создание
 * pledge/create
 *    - договор
 *    - залогодатель (+поиск)
 *    - имущество: (+поиск)
 *
 * B. Добавление залогодателя
 * pledge/:contractId/pledgor/create
 *    - залогодатель: (+поиск)
 *    - имущество: (+поиск)
 *
 * C. Добавление имущества
 * pledge/:contractId/pledgor/:pledgorId/property/create
 *    - имущество: (+поиск)
 *
 * D. Редактирование
 * pledge/:contractId/pledgor/:pledgorId/property/:propertyId
 *    - договор
 *    - залогодатель
 *    - имущество
 *
 *
 * Алгоритм
 * - Если есть заполненная форма договора (A, D) - создать (A) или изменить (D) договор
 * - Если есть вручную заполненная форма залогодателя (A, B, D) - создать (A, B) или изменить (D) персону
 * - Если есть вручную заполненная форма имущества (A, B, C, D) - создать (A, B, C) или изменить (D) имущество
 * - Если есть найденный залогодатель - создать связь между залогодателем и договором (A, B)
 * - Если есть найденное имущество - создать связь между залогодателем и имуществом (A, B, C)
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PledgeCardService } from './pledge-card.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { contractFormConfig } from './config/contract-form.config';
import { pledgorFormConfig } from './config/pledgor-form.config';
import { propertyFormConfig } from './config/property-form.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-pledge-card',
  templateUrl: 'pledge-card.component.html',
})
export class PledgeCardComponent implements AfterViewInit {
  @ViewChild('contractForm') contractForm: MetadataFormComponent<any>;
  @ViewChild('pledgorForm') pledgorForm: MetadataFormComponent<any>;
  @ViewChild('propertyForm') propertyForm: MetadataFormComponent<any>;

  readonly contractFormConfig = contractFormConfig;
  readonly pledgorFormConfig = pledgorFormConfig;
  readonly propertyFormConfig = propertyFormConfig;

  readonly pledgor$ = this.pledgeCardService.pledgor$;
  readonly isPledgorFormDisabled$ = this.pledgor$.pipe(
    map(Boolean),
  );

  readonly property$ = this.pledgeCardService.property$;
  readonly isPropertyFormDisabled$ = this.property$.pipe(
    map(Boolean),
  );

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor, pledgor and property)
   */
  readonly contractId = Number(this.paramMap.get('contractId'));

  /**
   * Debt ID
   */
  readonly debtId = Number(this.paramMap.get('debtId'));

  /**
   * ID of person who is a debtor (displayed in debtor card)
   */
  readonly debtorId = Number(this.paramMap.get('debtorId'));

  /**
   * ID of person who is linked as pledgor via contractId
   */
  readonly pledgorId = Number(this.paramMap.get('pledgorId'));

  /**
   * ID of property that is linked via contractId
   */
  readonly propertyId = Number(this.paramMap.get('propertyId'));

  readonly routeData = this.route.snapshot.data;
  readonly edit = this.routeData.edit;
  readonly showContractForm = this.routeData.showContractForm;
  readonly showPledgorForm = this.routeData.showPledgorForm;

  constructor(
    private personService: PersonService,
    private pledgeCardService: PledgeCardService,
    private pledgeService: PledgeService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    if (this.contractId) {
      this.fetchContract();
    }
    if (this.pledgorId) {
      this.fetchPledgor();
    }
    if (this.propertyId) {
      this.fetchProperty();
    }
  }

  onPledgorFormClear(): void {
    this.pledgeCardService.selectPledgor(null);
    this.pledgorForm.formGroup.reset();
  }

  onPropertyFormClear(): void {
    this.pledgeCardService.selectProperty(null);
    this.propertyForm.formGroup.reset();
  }

  onSave(): void {
    this.onBack();
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }

  private fetchContract(): void {
    this.pledgeService
      .fetch(this.debtId, this.contractId)
      .subscribe(contract => this.contractForm.formGroup.patchValue(contract));
  }

  private fetchPledgor(): void {
    this.personService
      .fetch(this.pledgorId)
      .subscribe(person => this.pledgorForm.formGroup.patchValue(person));
  }

  private fetchProperty(): void {
    this.propertyService
      .fetch(this.pledgorId, this.propertyId)
      .subscribe(property => this.propertyForm.formGroup.patchValue(property));
  }

  // private saveContract(): void {
  //   //
  // }

  // private savePledgor(): void {
  //   //
  // }

  // private saveProperty(): void {
  //   //
  // }
}
