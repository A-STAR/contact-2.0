import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map } from 'rxjs/operators';

import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { LayoutService } from '@app/core/layout/layout.service';
import { PledgeCardCreateContractService } from './create-contract.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';
import { PersonSearchComponent } from '@app/routes/workplaces/shared/person-search/person-search.component';
import { PropertySearchComponent } from '@app/routes/workplaces/shared/property-search/property-search.component';

import { DialogFunctions } from '@app/core/dialog';
import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { createContractLayout } from './create-contract.layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    PledgeCardCreateContractService,
  ],
  selector: 'app-pledge-card-create-contract',
  templateUrl: 'create-contract.component.html'
})
export class PledgeCardCreateContractComponent extends DialogFunctions implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild(PersonSearchComponent) personSearch: PersonSearchComponent;
  @ViewChild(PropertySearchComponent) propertySearch: PropertySearchComponent;

  @ViewChild('contractClearButton', { read: TemplateRef }) contractClearButtonTemplate: TemplateRef<any>;
  @ViewChild('contractTitlebar',    { read: TemplateRef }) contractTitlebarTemplate:    TemplateRef<any>;
  @ViewChild('pledgorClearButton',  { read: TemplateRef }) pledgorClearButtonTemplate:  TemplateRef<any>;
  @ViewChild('pledgorTitlebar',     { read: TemplateRef }) pledgorTitlebarTemplate:     TemplateRef<any>;
  @ViewChild('propertyClearButton', { read: TemplateRef }) propertyClearButtonTemplate: TemplateRef<any>;
  @ViewChild('propertyTitlebar',    { read: TemplateRef }) propertyTitlebarTemplate:    TemplateRef<any>;

  readonly layoutConfig = createContractLayout;

  readonly paramMap = this.route.snapshot.paramMap;

  readonly debtId = Number(this.paramMap.get('debtId'));

  readonly debtorId = Number(this.paramMap.get('debtorId'));

  readonly pledgorRole = 3;

  readonly phoneContactType = 1;

  readonly pledgor$ = this.pledgeCardCreateContractService.pledgor$;
  readonly property$ = this.pledgeCardCreateContractService.property$;

  readonly pledgorId$ = this.pledgor$.pipe(
    map(pledgor => pledgor ? pledgor.id : null),
  );

  readonly contractTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.contract.title',
  };

  readonly pledgorTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPledgorSearch(),
      },
    ]
  };

  readonly propertyTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.property.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPropertySearch(),
        enabled: this.pledgorId$.pipe(
          map(Boolean),
        ),
      },
    ],
  };

  readonly isSubmitDisabled$ = new BehaviorSubject<boolean>(false);

  readonly formData$ = combineLatest(this.pledgor$, this.property$).pipe(
    map(([ pledgor, property ]) => {
      return {
        default: pledgor ? pledgor : {},
        property: property ? property : {},
      };
    }),
  );

  dialog: string;

  templates: Record<string, TemplateRef<any>>;

  private subscriptionBag = new SubscriptionBag();

  constructor(
    private layoutService: LayoutService,
    private pledgeCardCreateContractService: PledgeCardCreateContractService,
    private pledgeService: PledgeService,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.templates = {
      contractClearButton: this.contractClearButtonTemplate,
      contractTitlebar: this.contractTitlebarTemplate,
      pledgorClearButton: this.pledgorClearButtonTemplate,
      pledgorTitlebar: this.pledgorTitlebarTemplate,
      propertyClearButton: this.propertyClearButtonTemplate,
      propertyTitlebar: this.propertyTitlebarTemplate,
    };

    const { url } = this.router;
    const routerSubscription = this.layoutService.navigationEnd$
      .pipe(
        filter((event: NavigationEnd) => event.urlAfterRedirects === url)
      )
      .subscribe(() => {
        this.layout.resetAndEnableAll();
        this.isSubmitDisabled$.next(true);
      });
    this.subscriptionBag.add(routerSubscription);
  }

  ngAfterViewInit(): void {
    const pledgorSubscription = this.pledgor$.subscribe(person => {
      this.layout.toggleFormGroup('default', !person);
    });
    this.subscriptionBag.add(pledgorSubscription);

    const propertySubscription = this.property$.subscribe(property => {
      this.layout.toggleFormGroup('property', !property);
    });
    this.subscriptionBag.add(propertySubscription);

    const disabledSubscription = combineLatest(
      this.pledgor$,
      this.property$,
      this.layout.canSubmit('contract'),
      this.layout.canSubmit('default'),
      this.layout.canSubmit('property'),
      this.layout.isValid('propertyValue'),
    )
    .subscribe(([ pledgor, property, contractValid, pledgorValid, propertyValid, propertyValueValid ]) => {
      const canSubmitPledgor = pledgor
        ? true
        : pledgorValid;
      const canSubmitProperty = property
        ? true
        : propertyValid;
      const isValid = canSubmitPledgor && canSubmitProperty && contractValid && propertyValueValid;
      this.isSubmitDisabled$.next(!isValid);
    });
    this.subscriptionBag.add(disabledSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptionBag.unsubscribe();
  }

  onPersonSearchSubmit(): void {
    this.pledgeCardCreateContractService.selectPledgor(this.personSearch.person);
    this.closeDialog();
  }

  onPropertySearchSubmit(): void {
    this.pledgeCardCreateContractService.selectProperty(this.propertySearch.property);
    this.closeDialog();
  }

  onSave(): void {
    const contractData = this.layout.getData('contract');
    const pledgorData = this.layout.getData();
    const propertyData = this.layout.getData('property');
    const propertyValueData = this.layout.getData('propertyValue');
    this.pledgeCardCreateContractService
      .createContract(this.debtId, contractData, pledgorData, propertyData, propertyValueData)
      .subscribe(() => this.onSuccess());
  }

  onBack(): void {
    this.routingService.navigateToUrl('/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit');
  }

  onContactFormClear(): void {
    const isDisabled = this.layout.isFormDisabled('contract');
    this.layout.resetForm('contract');
    if (isDisabled) {
      this.layout.disableFormGroup('contract');
    }
  }

  onPledgorFormClear(): void {
    this.pledgeCardCreateContractService.selectPledgor(null);
    this.layout.resetForm();
  }

  onPropertyFormClear(): void {
    this.pledgeCardCreateContractService.selectProperty(null);
    this.layout.resetForm('property');
    this.layout.resetForm('propertyValue');
  }

  private onSuccess(): void {
    this.pledgeService.dispatchPledgeSavedMessage();
    this.onBack();
  }

  private openPledgorSearch(): void {
    this.setDialog('person-search');
  }

  private openPropertySearch(): void {
    this.setDialog('property-search');
  }
}
