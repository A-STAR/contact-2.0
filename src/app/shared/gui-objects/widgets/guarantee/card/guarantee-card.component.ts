import { AfterViewInit, Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuaranteeContract, IGuarantor } from '../guarantee.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { GuaranteeService } from '../guarantee.service';
import { GuarantorService } from '../../guarantor/guarantor.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.guaranteeContract.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-guarantee-card',
  templateUrl: './guarantee-card.component.html'
})
export class GuaranteeCardComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private canEdit: boolean;
  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;
  private personId: number;
  private guarantorSelectionSub: Subscription;

  controls: IDynamicFormGroup[] = null;
  contract: IGuaranteeContract;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private guaranteeService: GuaranteeService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canSubmit(): boolean {
    if (this.isRoute('addGuarantor') && !!this.personId) {
      return true;
    }
    return this.form && this.form.canSubmit;
  }

  ngOnInit(): void {
    const contract = this.messageBusService.takeValue<IGuaranteeContract>('contract') || {};

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE),
      contract.id
        ? this.userPermissionsService.has('GUARANTEE_EDIT')
        : this.userPermissionsService.has('GUARANTEE_ADD'),
    )
    .take(1)
    .subscribe(([ respTypeOpts, canEdit ]) => {
      const controls: IDynamicFormGroup[] = [
        {
          title: 'widgets.guaranteeContract.title', collapsible: true,
          children: [
            { label: label('personId'), controlName: 'personId',  type: 'number', required: true, display: false },
            { label: label('contractNumber'), controlName: 'contractNumber',  type: 'text', required: true },
            { label: label('contractStartDate'), controlName: 'contractStartDate', type: 'datepicker', },
            { label: label('contractEndDate'), controlName: 'contractEndDate', type: 'datepicker', },
            {
              label: label('contractTypeCode'), controlName: 'contractTypeCode',
              type: 'select', options: respTypeOpts, required: true
            },
            { label: label('comment'), controlName: 'comment', type: 'textarea', },
          ]
        },
      ];

      this.personId = contract.personId;
      this.controls = controls;
      this.contract = contract;
      this.canEdit = canEdit;
      this.cdRef.markForCheck();
    });

    this.guarantorSelectionSub = this.messageBusService
      .select<string, IGuarantor>(GuarantorService.MESSAGE_GUARANTOR_SELECTION_CHANGED)
      .subscribe(guarantor => {
        const personId = this.form.getControl('personId');
        personId.setValue(guarantor.id);
        personId.markAsDirty();
      });
  }

  ngAfterViewInit(): void {
    if ((this.isRoute('addGuarantor') || this.isRoute('view') || !this.canEdit) && this.form) {
      this.form.form.disable();
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.guarantorSelectionSub) {
      this.guarantorSelectionSub.unsubscribe();
    }
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 2);
  }

  onSubmit(): void {
    const data = this.isRoute('create') ? this.form.serializedUpdates : this.form.serializedValue;
    const action = this.isRoute('create')
      ? this.guaranteeService.create(this.debtId, { ...data, personId: this.personId })
      : this.guaranteeService.update(this.debtId, this.contract.id, data);

    action.subscribe(() => {
      this.guaranteeService.notify(GuaranteeService.MESSAGE_GUARANTEE_CONTRACT_SAVED);
      this.onBack();
    });
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/') === segment;
  }
}
