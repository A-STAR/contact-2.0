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
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { map, mapTo, mergeMap } from 'rxjs/operators';

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

  readonly createMode = !this.contractId;
  readonly addPledgorMode = !!this.contractId && !this.pledgorId;
  readonly addPropertyMode = !!this.pledgorId && !this.propertyId;
  readonly editMode = !!this.propertyId;

  readonly showContractForm = this.createMode || this.editMode;
  readonly showPledgorForm = this.createMode || this.addPledgorMode || this.editMode;

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
    if (this.createMode) {
      this.createPledge();
    }
    if (this.addPledgorMode) {
      this.addPledgor();
    }
    if (this.addPropertyMode) {
      this.addProperty();
    }
    if (this.editMode) {
      this.updatePledge();
    }
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

  /**
   *  1. Создание персоны (если форма заполнена вручную, а не через поиск персоны)
   *     http://confluence.luxbase.int:8090/display/WEB20/Persons#Persons-POST/persons
   *  2. Создание имущества (если форма заполнена вручную, а не через поиск имущества)
   *     http://confluence.luxbase.int:8090/display/WEB20/Person+Property#PersonProperty-POST/persons/{personsId}/property
   *     - форма имущества
   *  3. Создание договора
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-POSTdebts/{debtsId}/pledgeContract
   *     - форма договора
   *     - ID залогодателя
   *     - ID имущества
   *     - стоимость имущества в договоре
   */
  private createPledge(): void {
    const propertyData = this.propertyForm.data;
    const { pledgeValue, marketValue, currencyId } = propertyData;
    combineLatest([
      this.savePledgor(),
      this.saveProperty(),
    ])
    .pipe(
      mergeMap(([ personId, propertyId ]) => {
        const contract = {
          ...this.contractForm.data as any,
          pledgors: [
            {
              personId,
              properties: [
                {
                  propertyId,
                  pledgeValue,
                  marketValue,
                  currencyId,
                },
              ],
            },
          ],
        };
        return this.pledgeService.create(this.debtId, contract);
      }),
    )
    .subscribe(() => this.onSuccess());
  }

  // tslint:disable:max-line-length
  /**
   *  1. Создание персоны (если форма заполнена вручную, а не через поиск персоны)
   *     http://confluence.luxbase.int:8090/display/WEB20/Persons#Persons-POST/persons
   *  2. Создание имущества (если форма заполнена вручную, а не через поиск имущества)
   *     http://confluence.luxbase.int:8090/display/WEB20/Person+Property#PersonProperty-POST/persons/{personsId}/property
   *     - форма имущества
   *  3. Создание связи с договором
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-POSTdebts/{debtsId}/pledgeContract/{pledgeContractId}/pledgor
   *     - ID залогодателя
   *     - ID имущества
   *     - стоимость имущества в договоре
   */
  // tslint:enable:max-line-length
  private addPledgor(): void {
    const propertyData = this.propertyForm.data;
    const { pledgeValue, marketValue, currencyId } = propertyData;
    combineLatest([
      this.savePledgor(),
      this.saveProperty(),
    ])
    .pipe(
      mergeMap(([ personId, propertyId ]) => {
        const pledgor = {
          personId,
          properties: [
            {
              propertyId,
              pledgeValue,
              marketValue,
              currencyId,
            },
          ],
        };
        return this.pledgeService.addPledgor(this.debtId, this.contractId, pledgor);
      }),
    )
    .subscribe(() => this.onSuccess());
  }

  // tslint:disable:max-line-length
  /**
   *  1. Создание имущества (если форма заполнена вручную, а не через поиск имущества)
   *     http://confluence.luxbase.int:8090/display/WEB20/Person+Property#PersonProperty-POST/persons/{personsId}/property
   *     - форма имущества
   *  2. Создание связи с договором
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-POSTdebts/{debtsId}/pledgeContract/{pledgeContractId}/pledgor
   *     - ID залогодателя
   *     - ID имущества
   *     - стоимость имущества в договоре
   */
  // tslint:enable:max-line-length
  private addProperty(): void {
    const propertyData = this.propertyForm.data;
    const { pledgeValue, marketValue, currencyId } = propertyData;
    this.saveProperty().pipe(
      mergeMap((propertyId) => {
        const pledgor = {
          personId: this.pledgorId,
          properties: [
            {
              propertyId,
              pledgeValue,
              marketValue,
              currencyId,
            },
          ],
        };
        return this.pledgeService.addPledgor(this.debtId, this.contractId, pledgor);
      }),
    )
    .subscribe(() => this.onSuccess());
  }

  // tslint:disable:max-line-length
  /**
   *  1. Изменение персоны (если форма dirty)
   *     http://confluence.luxbase.int:8090/display/WEB20/Persons#Persons-PUT/persons/{personsId}
   *  2. Изменение имущества (если форма dirty)
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-PUTdebts/{debtsId}/pledgeContract/{pledgeContractId}/pledgor/{pledgorId}/property/{propertyId}
   *     - форма имущества
   *     - стоимость имущества в договоре
   *  3. Изменение договора (если форма dirty)
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-PUTdebts/{debtsId}/pledgeContract/{pledgeContractId}
   *     - форма договора
   */
  // tslint:enable:max-line-length
  private updatePledge(): void {
    const contract = this.contractForm.data as any;
    combineLatest([
      this.savePledgor(),
      this.saveProperty(),
      this.pledgeService.update(this.debtId, this.contractId, contract),
    ])
    .subscribe(() => this.onSuccess());
  }

  private savePledgor(): Observable<number> {
    return this.pledgor$.pipe(
      mergeMap(pledgor => {
        if (pledgor) {
          return of(pledgor.id);
        } else {
          const data = this.pledgorForm.data;
          return this.pledgorId
            ? this.personService.update(this.pledgorId, data).pipe(mapTo(this.pledgorId))
            : this.personService.create(data);
        }
      }),
    );
  }

  private saveProperty(): Observable<number> {
    return this.property$.pipe(
      mergeMap(property => {
        if (property) {
          return of(property.id);
        } else {
          const data = this.propertyForm.data as any;
          return this.propertyId
            ? this.propertyService.update(this.pledgorId, this.propertyId, data).pipe(mapTo(this.propertyId))
            : this.propertyService.create(this.pledgorId, data);
        }
      }),
    );
  }

  private onSuccess(): void {
    this.pledgeService.dispatchPledgeSavedMessage();
    this.onBack();
  }
}
