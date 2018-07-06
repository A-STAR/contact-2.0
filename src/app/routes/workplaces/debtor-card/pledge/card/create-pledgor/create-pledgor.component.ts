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

import { ITitlebar, ToolbarItemType } from '@app/shared/components/titlebar/titlebar.interface';

import { LayoutService } from '@app/core/layout/layout.service';
import { PledgeCardCreatePledgorService } from './create-pledgor.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';
import { PersonSearchComponent } from '@app/routes/workplaces/shared/person-search/person-search.component';
import { PropertySearchComponent } from '@app/routes/workplaces/shared/property-search/property-search.component';

import { DialogFunctions } from '@app/core/dialog';
import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { createPledgorLayout } from './create-pledgor.layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    PledgeCardCreatePledgorService,
  ],
  selector: 'app-pledge-card-create-pledgor',
  templateUrl: 'create-pledgor.component.html'
})
export class PledgeCardCreatePledgorComponent extends DialogFunctions implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild(PersonSearchComponent) personSearch: PersonSearchComponent;
  @ViewChild(PropertySearchComponent) propertySearch: PropertySearchComponent;

  @ViewChild('pledgorClearButton',  { read: TemplateRef }) pledgorClearButtonTemplate:  TemplateRef<any>;
  @ViewChild('pledgorTitlebar',     { read: TemplateRef }) pledgorTitlebarTemplate:     TemplateRef<any>;
  @ViewChild('propertyClearButton', { read: TemplateRef }) propertyClearButtonTemplate: TemplateRef<any>;
  @ViewChild('propertyTitlebar',    { read: TemplateRef }) propertyTitlebarTemplate:    TemplateRef<any>;

  readonly layoutConfig = createPledgorLayout;

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor, pledgor and property)
   */
  readonly contractId = Number(this.paramMap.get('contractId'));

  readonly debtId = Number(this.paramMap.get('debtId'));

  readonly debtorId = Number(this.paramMap.get('debtorId'));

  readonly pledgorRole = 3;

  readonly phoneContactType = 1;

  readonly pledgor$ = this.pledgeCardCreatePledgorService.pledgor$;
  readonly property$ = this.pledgeCardCreatePledgorService.property$;

  readonly pledgorId$ = this.pledgor$.pipe(
    map(pledgor => pledgor ? pledgor.id : null),
  );

  readonly pledgorTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.title',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.SEARCH,
        action: () => this.openPledgorSearch(),
      },
    ]
  };

  readonly propertyTitlebarConfig: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.property.title',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.SEARCH,
        action: () => this.openPropertySearch(),
        enabled: this.pledgorId$.pipe(
          map(Boolean),
        ),
      },
    ]
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
    private pledgeCardCreatePledgorService: PledgeCardCreatePledgorService,
    private pledgeService: PledgeService,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.templates = {
      pledgorClearButton: this.pledgorClearButtonTemplate,
      pledgorTitlebar: this.pledgorTitlebarTemplate,
      propertyClearButton: this.propertyClearButtonTemplate,
      propertyTitlebar: this.propertyTitlebarTemplate,
    };

    // One of many reasons route reuse is inconvenient
    const { url } = this.router;
    const routerSubscription = this.layoutService.navigationEnd$
      .pipe(
        filter((event: NavigationEnd) => event.urlAfterRedirects === url)
      )
      .subscribe(() => {
        this.layout.resetAndEnableAll();
        this.isSubmitDisabled$.next(true);
        this.subscriptionBag.add(routerSubscription);
      });
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
      this.layout.canSubmit('default'),
      this.layout.canSubmit('property'),
      this.layout.isValid('propertyValue'),
    )
    .subscribe(([ pledgor, property, pledgorValid, propertyValid, propertyValueValid ]) => {
      const canSubmitPledgor = pledgor
        ? true
        : pledgorValid;
      const canSubmitProperty = property
        ? true
        : propertyValid;
      const isValid = canSubmitPledgor && canSubmitProperty && propertyValueValid;
      this.isSubmitDisabled$.next(!isValid);
    });
    this.subscriptionBag.add(disabledSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptionBag.unsubscribe();
  }

  onPersonSearchSubmit(): void {
    this.pledgeCardCreatePledgorService.selectPledgor(this.personSearch.person);
    this.closeDialog();
  }

  onPropertySearchSubmit(): void {
    this.pledgeCardCreatePledgorService.selectProperty(this.propertySearch.property);
    this.closeDialog();
  }

  onSave(): void {
    const pledgor = this.layout.getData();
    const property = this.layout.getData('property');
    const propertyValue = this.layout.getData('propertyValue');
    this.pledgeCardCreatePledgorService
      .createPledgor(this.debtId, this.contractId, pledgor, property, propertyValue)
      .subscribe(() => this.onSuccess());
  }

  onBack(): void {
    this.routingService.navigateToUrl('/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit');
  }

  onPledgorFormClear(): void {
    this.pledgeCardCreatePledgorService.selectPledgor(null);
    this.layout.resetForm();
  }

  onPropertyFormClear(): void {
    this.pledgeCardCreatePledgorService.selectProperty(null);
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
