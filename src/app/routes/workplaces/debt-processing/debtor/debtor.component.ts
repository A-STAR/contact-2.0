import { Component, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormGroup } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IPerson } from './debtor.interface';

import { DebtorService } from './debtor.service';

import { EntityBaseComponent } from '../../../../shared/components/entity/edit/entity.base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss'],
})
export class DebtorComponent implements OnDestroy {
  static COMPONENT_NAME = 'DebtorComponent';

  person: IPerson;

  private personId = (this.route.params as any).value.id || null;

  // selectedDebtorSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
  ) {
    // Observable.combineLatest(
    //   this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE),
    //   this.userPermissionsService.has('ADDRESS_EDIT'),
    //   this.userPermissionsService.has('ADDRESS_COMMENT_EDIT'),
    //   // TODO(d.maltsev): pass entity type
    //   this.addressId ? this.addressService.fetch(18, this.id, this.addressId) : Observable.of(null)
    // )

    // this.debtorService.fetch(this.selectedDebtorId);
    // this.selectedDebtorSub = this.debtorService.selectedDebtor
    //   .filter(Boolean)
    //   .filter(debtor => !!debtor.id)
    //   .filter(debtor => !!debtor.generalInformation.id)
    //   .subscribe(debtor => {
    //     this.debtor = debtor;
    //     this.generalInformation = debtor ? debtor.generalInformation : null;
    //     this.generalInformationPhones = this.generalInformation ? this.generalInformation.phones : null;
    //     this.cdRef.markForCheck();
    //   });
  }

  ngOnDestroy(): void {
    // this.selectedDebtorSub.unsubscribe();
  }

  protected getControls(): IDynamicFormGroup[] {
    // TODO(d.maltsev): use dictionary service
    const typeOptions = [ { value: 1, label: 'Physical person' }, { value: 2, label: 'Legal entity' } ];
    return [
      {
        children: [
          { width: 1, label: 'debtor.id', controlName: 'id', type: 'number', required: true, disabled: true },
          { width: 2, label: 'debtor.lastName', controlName: 'lastName', type: 'text' },
          { width: 2, label: 'debtor.firstName', controlName: 'firstName', type: 'text' },
          { width: 2, label: 'debtor.middleName', controlName: 'middleName', type: 'text' },
          { width: 2, label: 'debtor.type', controlName: 'type', type: 'select', options: typeOptions },
          { width: 2, label: 'debtor.responsible', controlName: 'responsible', type: 'text' },
          { width: 1, label: 'debtor.reward', controlName: 'reward', type: 'number' },
        ]
      }
    ];
  }
}
